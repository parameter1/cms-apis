import { MongoDBClient } from '@cms-apis/mongodb';
import { MONGO_URL } from '../env.js';
import pkg from '../../package.js';

export default new MongoDBClient({
  url: MONGO_URL,
  options: { appName: `${pkg.name} v${pkg.version} (env: ${process.env.NODE_ENV})` },
});
