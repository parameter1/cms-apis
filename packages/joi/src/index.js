import Joi from 'joi';

import {
  any,
  number,
  integer,
  object,
  objectId,
  slug,
  string,
} from './types/index.js';

export { default as validateAsync } from './validate-async.js';
export { default as validate } from './validate.js';

export default Joi
  .extend(any)
  .extend(number)
  .extend(integer)
  .extend(object)
  .extend(objectId)
  .extend(string)
  .extend(slug);
