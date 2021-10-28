import { MongoDBClient, Repo, ObjectId } from '@cms-apis/mongodb';
import { isObject } from '@cms-apis/utils';
import { get } from '@cms-apis/object-path';
import resources from '../resources.js';

export default class LegacyDB {
  /**
   *
   * @param {object} params
   * @param {string} params.tenant The tenant key to load the repos for.
   * @param {MongoDBClient} params.client The MongoDB client/connection to use.
   */
  constructor({ tenant, client } = {}) {
    if (!tenant) throw new Error('A tenant is required.');
    if (!(client instanceof MongoDBClient)) throw new Error('A MongoDBClient instance is required.');
    this.tenant = tenant.trim();
    this.client = client;
    this.namespaces = resources.reduce((m, { namespace, models }) => {
      if (!m.has(namespace)) m.set(namespace, new Map());
      models.forEach(({ legacy: name }) => {
        m.get(namespace).set(name, new Repo({
          client: this.client,
          name: `${namespace}.${name}`,
          dbName: `${this.tenant}_${namespace}`,
          collectionName: name,
        }));
      });
      return m;
    }, new Map());
  }

  /**
   * Gets a repository for the provided namespace + model key.
   *
   * @param {string} key The repo key, e.g. `website.Section`
   * @returns {Repo}
   */
  repo(key) {
    const [namespace, model] = key.split('.');
    if (!namespace || !model) throw new Error('Invalid repo key. The key must contain a namespace and a model, e.g. `platform.Content`');
    const models = this.namespaces.get(namespace);
    if (!models) throw new Error(`No namespace is registered for ${namespace}`);
    const repo = models.get(model);
    if (!repo) throw new Error(`No model found for ${namespace}.${model}`);
    return repo;
  }

  /**
   * Coerces a string ID to either a MongoDB ObjectID or an integer.
   *
   * If the `id` value is not a string, or does not match the requirements for
   * the above, the `id` value will be returned as-is.
   *
   * @param {*} id
   */
  static coerceId(id) {
    if (typeof id !== 'string') return id;
    if (/^[a-f0-9]{24}$/.test(id)) return new ObjectId(id);
    if (/^\d+$/.test(id)) return parseInt(id, 10);
    return id;
  }

  /**
   * Gets a Mongo ID from either a complex (DBRef) or simple (ID) reference.
   *
   * @param {*} ref The reference value.
   */
  static extractRefId(ref) {
    const id = isObject(ref) && ref.oid ? ref.oid : ref;
    return LegacyDB.coerceId(id) || null;
  }

  static extractRefIdFromPath(obj, path) {
    const ref = get(obj, path);
    return LegacyDB.extractRefId(ref);
  }

  /**
   * Gets an array of Mongo IDs from an array
   * of either complex (DBRef) or simple (ID) references.
   *
   * @param {array} refs
   */
  static extractRefIds(refs) {
    if (!Array.isArray(refs) || !refs.length) return [];
    return refs.map((ref) => LegacyDB.extractRefId(ref)).filter((id) => id);
  }

  static extractRefIdsFromPath(obj, path) {
    const refs = get(obj, path);
    return LegacyDB.extractRefIds(refs);
  }
}
