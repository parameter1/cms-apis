import { MongoDBClient, Repo, ObjectId } from '@cms-apis/mongodb';
import MongoDBRepoLoader from '@cms-apis/dataloader';
import resources from '../resources.js';

export default class DB {
  /**
   * Database wrapper for all CMS resources. Creates query repositories and dataloaders
   * for each collection. As such, this _should_ be instantiated on each request, otherwise
   * loader cache will persist across requests.
   *
   * @param {object} params
   * @param {string} params.tenant The tenant key to load the repos for.
   * @param {MongoDBClient} params.client The MongoDB client/connection to use.
   * @param {function} [params.logger] An optional logging function.
   */
  constructor({ tenant, client, logger } = {}) {
    if (!tenant) throw new Error('A tenant is required.');
    if (!(client instanceof MongoDBClient)) throw new Error('A MongoDBClient instance is required.');
    this.tenant = tenant.trim().replace('_', '-');
    this.client = client;

    this.repos = new Map();
    this.loaders = new Map();

    resources.forEach((resource) => {
      const indexes = resource.get('indexes');
      const integerId = resource.get('integerId');
      const types = resource.get('types');

      const repo = new Repo({
        client: this.client,
        name: resource.get('name'),
        dbName: `cms-${this.tenant}`,
        logger,
        collectionName: resource.get('collection'),
        ...(integerId && { integerId: integerId.toJS() }),
        ...(indexes && { indexes: indexes.toJS() }),
        ...(types && { globalFindCriteria: { _type: { $in: types.toJS() } } }),
      });

      const loader = new MongoDBRepoLoader({
        name: resource.get('name'),
        repo,
        logger,
        coercionFn: DB.coerceId,
      });

      const collectionName = resource.get('collection');
      this.repos.set(collectionName, repo);
      this.loaders.set(collectionName, loader);
    });
  }

  /**
   * Gets a loader for the provided collection name
   *
   * @param {string} key The loader key, e.g. `website-sections`
   * @returns {Repo}
   */
  loader(key) {
    const loader = this.loaders.get(key);
    if (!loader) throw new Error(`No dataloader found for ${key}`);
    return loader;
  }

  /**
   * Gets a repository for the provided collection name
   *
   * @param {string} key The repo key, e.g. `website-sections`
   * @returns {Repo}
   */
  repo(key) {
    const repo = this.repos.get(key);
    if (!repo) throw new Error(`No repository found for ${key}`);
    return repo;
  }

  /**
   * Creates indexes for all repos, where defined for each repo
   */
  createIndexes() {
    return Promise.all(Array.from(this.repos).map(([, repo]) => repo.createIndexes()));
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
}
