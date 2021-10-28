import { MongoDBClient, Repo } from '@cms-apis/mongodb';
import resources from '../resources.js';

export default class DB {
  /**
   *
   * @param {object} params
   * @param {string} params.tenant The tenant key to load the repos for.
   * @param {MongoDBClient} params.client The MongoDB client/connection to use.
   */
  constructor({ tenant, client } = {}) {
    if (!tenant) throw new Error('A tenant is required.');
    if (!(client instanceof MongoDBClient)) throw new Error('A MongoDBClient instance is required.');
    this.tenant = tenant.trim().replace('_', '-');
    this.client = client;
    this.repos = resources.reduce((m, { namespace, models }) => {
      models.forEach(({ name }) => {
        const collectionName = `${namespace}-${name}`;
        m.set(collectionName, new Repo({
          client: this.client,
          name: `${namespace} ${name}`,
          dbName: `cms-${this.tenant}`,
          collectionName,
        }));
      });
      return m;
    }, new Map());
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
}
