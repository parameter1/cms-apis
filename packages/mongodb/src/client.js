import { MongoClient } from 'mongodb';

/**
 *
 * @param {object} params
 * @param {string} params.url The database URL to connect to
 * @param {MongoClientOptions} [params.options={}] Options to pass to `MongoClient.connect`
 */
export default function MongoDBClient({ url, options: clientOptions } = {}) {
  const client = new MongoClient(url, clientOptions);
  let connectPromise;

  /**
   * Connects to the server.
   *
   * @returns {Promise<MongoClient>}
   */
  const connect = async () => {
    if (!connectPromise) connectPromise = client.connect();
    await connectPromise;
    return client;
  };

  /**
   * Create a new Db instance sharing the current socket connections.
   *
   * @param {object} params
   * @param {string} params.name The database name
   * @param {object} params.options Options to pass to the `MongoClient.db` method
   * @return {Promise<Db>}
   */
  const db = async ({ name, options } = {}) => {
    await connect();
    return client.db(name, options);
  };

  /**
   * Fetch a specific collection.
   *
   * @param {object} params
   * @param {string} params.dbName The database name
   * @param {string} params.name The collection name
   * @param {object} [params.options={}] Options to pass to the `Db.collection` method
   * @return {Promise<Collection>}
   */
  const collection = async ({
    dbName,
    name,
    options = {},
  } = {}) => {
    const dbInstance = await db({ name: dbName });
    return dbInstance.collection(name, options);
  };

  /**
   * Closes the connection to the server.
   *
   * @param {boolean} [force] Whether to forcefully close the connection.
   * @return {Promise<void>}
   */
  const close = async (force) => {
    if (!connectPromise) return null;
    await connect();
    return client.close(force);
  };

  return {
    connect,
    db,
    collection,
    close,
  };
}
