import Joi from 'joi';

import { objectCollapsible, stringSingleline } from './rules/index.js';

import {
  any,
  number,
  integer,
  objectId,
  slug,
  str,
} from './types/index.js';

export { default as validateAsync } from './validate-async.js';
export { default as validate } from './validate.js';

const withRules = Joi
  .extend(objectCollapsible)
  .extend(stringSingleline);

export default withRules
  .extend(any)
  .extend(number)
  .extend(integer)
  .extend(objectId)
  .extend(str)
  .extend(slug);
