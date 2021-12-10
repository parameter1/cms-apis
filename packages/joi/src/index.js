import Joi from 'joi';

import { integer, objectId, str } from './types/index.js';

export { default as validateAsync } from './validate-async.js';
export { default as validate } from './validate.js';

export default Joi.extend(integer).extend(objectId).extend(str);
