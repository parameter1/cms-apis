import Joi from 'joi';

import { objectCollapsible, stringSingleline } from './rules/index.js';

import {
  float,
  integer,
  objectId,
  slug,
  str,
} from './types/index.js';

export { default as validateAsync } from './validate-async.js';
export { default as validate } from './validate.js';

export default Joi
  .extend(objectCollapsible)
  .extend(stringSingleline)
  .extend(float)
  .extend(integer)
  .extend(objectId)
  .extend(str)
  .extend(slug);
