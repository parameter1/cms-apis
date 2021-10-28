import { MongoDBClient, Repo } from '@cms-apis/mongodb';
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
}
