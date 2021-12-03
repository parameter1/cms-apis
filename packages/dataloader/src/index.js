import DataLoader from 'dataloader';
import { asObject, isFunction as isFn } from '@cms-apis/utils';
import { createQueryMap, reduceKeys } from './utils/index.js';

export default class MongoDBRepoLoader {
  /**
   * @param {object} params
   * @param {string} params.name The dataloader name
   * @param {Repo} params.repo The MongoDB repo to load data from
   * @param {object} [params.options] Options to send to the data loader
   * @param {object} [params.logger] A key logger to use when loading
   * @param {function} [params.coercionFn] An optional identifier value coercion function
   */
  constructor({
    name,
    repo,
    options,
    logger,
    coercionFn,
  } = {}) {
    this.name = name;
    this.repo = repo;
    this.logger = logger;
    this.coercionFn = coercionFn;
    this.loader = new DataLoader(this.batchLoadFn.bind(this), {
      ...options,
      cacheKeyFn: MongoDBRepoLoader.cacheKeyFn,
    });
  }

  /**
   * @param {object} params
   * @param {string} [params.foreignField=_id] The foreign field to query.
   * @param {*} params.value The document id value to load
   * @param {object} [params.projection] The document projection object (e.g. the fields to return)
   */
  load({ foreignField = '_id', value, projection } = {}) {
    const { fields } = MongoDBRepoLoader.prepare({ foreignField, projection });
    const key = { foreignField, value, fields };
    return this.loader.load(key);
  }

  /**
   * @param {object} params
   * @param {string} [params.foreignField=_id] The foreign field to query.
   * @param {*[]} params.values The document id values to load
   * @param {object} [params.projection] The document projection object (e.g. the fields to return)
   */
  loadMany({ foreignField = '_id', values, projection } = {}) {
    const { fields } = MongoDBRepoLoader.prepare({ foreignField, projection });
    const keys = values.map((value) => ({ foreignField, value, fields }));
    return this.loader.loadMany(keys);
  }

  /**
   * @private
   * @param {array} keys
   */
  async batchLoadFn(keys) {
    const { coercionFn, logger, name } = this;
    const idMap = reduceKeys(keys);
    const queryMap = createQueryMap(idMap);

    const promises = [];
    queryMap.forEach(({ foreignField, values, projection }) => {
      const coerced = isFn(coercionFn) ? values.map(coercionFn) : values;
      const query = { [foreignField]: { $in: coerced } };
      if (isFn(logger)) {
        logger('Loader keys:', {
          name,
          foreignField,
          values: coerced,
          projection,
        });
      }
      promises.push((async () => {
        const cursor = await this.repo.find({ query, options: { projection } });
        const docs = await cursor.toArray();
        return { foreignField, docs };
      })());
    });
    // load all query results
    const resultSets = await Promise.all(promises);
    // reduce all result sets into a single map keyed by foreign field + lookup value
    const resultMap = new Map();
    resultSets.forEach(({ foreignField, docs }) => {
      docs.forEach((doc) => {
        const key = `${foreignField}:${doc[foreignField]}`;
        resultMap.set(key, doc);
      });
    });
    return keys.map(({ foreignField, value }) => {
      const key = `${foreignField}:${value}`;
      const doc = resultMap.get(key) || null;
      if (!doc) process.emitWarning(`WARNING: No result for ${name} using key ${key}`);
      return doc;
    });
  }

  /**
   * @param {object} params
   * @param {string} params.foreignField
   * @param {*} params.value
   * @param {array} params.fields
   */
  static cacheKeyFn({ foreignField, value, fields }) {
    return JSON.stringify({ [foreignField]: value, fields });
  }

  /**
   * @param {object} params
   * @param {object} [params.projection]
   */
  static prepare({ foreignField, projection } = {}) {
    const projectKeys = new Set(Object.keys(asObject(projection)));
    // ensure `_id` is added when projected fields are set
    // this ensures that the project cache key will be consistent
    // also ensure the foreign field is projected
    if (projectKeys.size) {
      projectKeys.add('_id');
      projectKeys.add(foreignField);
    }
    // sort the fields for consistent cache key resolution
    const fields = [...projectKeys].sort();
    return { fields };
  }
}
