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
    this.repos = new Map();
    resources.forEach((resource) => {
      this.repos.set(resource.get('collection'), new Repo({
        client: this.client,
        name: resource.get('name'),
        dbName: `cms-${this.tenant}`,
        collectionName: resource.get('collection'),
      }));
    });
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
