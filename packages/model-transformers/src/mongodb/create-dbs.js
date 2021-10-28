import { DB, LegacyDB } from '@cms-apis/db';
import { mongoDB, legacyMongoDB } from './clients.js';

export default ({ tenant } = {}) => ({
  main: new DB({ tenant, client: mongoDB }),
  legacy: new LegacyDB({ tenant, client: legacyMongoDB }),
});
