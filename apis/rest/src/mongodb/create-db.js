import { DB } from '@cms-apis/db';
import client from './client.js';

export default ({ tenant, logger } = {}) => new DB({ tenant, client, logger });
