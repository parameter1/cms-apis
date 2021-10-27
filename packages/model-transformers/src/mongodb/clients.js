import { MongoDBClient } from '@cms-apis/mongodb';
import { LEGACY_MONGO_URL, MONGO_URL } from '../env.js';
import pkg from '../../package.js';

const appName = `${pkg.name} v${pkg.version} (env: ${process.env.NODE_ENV})`;

export const mongoDB = new MongoDBClient({
  url: MONGO_URL,
  options: { appName },
});

export const legacyMongoDB = new MongoDBClient({
  url: LEGACY_MONGO_URL,
  options: { appName },
});
