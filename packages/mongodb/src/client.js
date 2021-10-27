import { MongoClient } from 'mongodb';

/**
 *
 * @param {object} params
 * @param {string} params.url The database URL to connect to
 * @param {MongoClientOptions} [params.options={}] Options to pass to `MongoClient.connect`
 */
export default function MongoDBClient({ url, options } = {}) {
  const client = new MongoClient(url, options);
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
    close,
  };
}
