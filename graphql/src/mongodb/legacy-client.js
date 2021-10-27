import { MongoDBClient } from '@cms-apis/mongodb';
import { LEGACY_MONGO_URL } from '../env.js';
import pkg from '../../package.js';

export default new MongoDBClient({
  url: LEGACY_MONGO_URL,
  options: { appName: `${pkg.name}/${pkg.version}` },
});
