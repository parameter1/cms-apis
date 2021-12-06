import { createHash } from 'crypto';

export default (value) => createHash('sha1').update(value).digest('hex');
