import { DB } from '@cms-apis/db';
import client from './client.js';

export default ({ tenant } = {}) => new DB({ tenant, client });
