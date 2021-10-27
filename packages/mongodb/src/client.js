import { MongoClient } from 'mongodb';
import filterURL from './utils/filter-url.js';

export default class MongoDBClient {
  /**
   *
   * @param {object} params
   * @param {string} params.url The database URL to connect to
   * @param {MongoClientOptions} [params.options={}] Options to pass to `MongoClient.connect`
   */
  constructor({ url, options } = {}) {
    this.client = new MongoClient(url, options);
    this.url = filterURL(this.client);
  }

  /**
   * Closes the connection to the server.
   *
   * @param {boolean} [force] Whether to forcefully close the connection.
   * @return {Promise<void>}
   */
  async close(force) {
    if (!this.promise) return null;
    await this.promise;
    return this.client.close(force);
  }

  /**
   * Fetch a specific collection.
   *
   * @param {object} params
   * @param {string} params.dbName The database name
   * @param {string} params.name The collection name
   * @param {object} [params.options={}] Options to pass to the `Db.collection` method
   * @return {Promise<mongodb.Collection>}
   */
  async collection({ dbName, name, options = {} } = {}) {
    const db = await this.db({ name: dbName });
    return db.collection(name, options);
  }

  /**
   * Connects to the server.
   *
   * @return {Promise<MongoClient>}
   */
  async connect() {
    if (!this.promise) this.promise = this.client.connect(this.url, this.options);
    return this.promise;
  }

  /**
   * Create a new Db instance sharing the current socket connections.
   *
   * @param {object} params
   * @param {string} params.name The database name
   * @param {object} params.options Options to pass to the `MongoClient.db` method
   * @return {Promise<Db>}
   */
  async db({ name, options } = {}) {
    await this.connect();
    return this.client.db(name, options);
  }
}
