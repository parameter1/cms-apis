import Joi from 'joi';

import {
  any,
  htmlExpanded,
  htmlFull,
  htmlLimited,
  hostname,
  number,
  integer,
  integerId,
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
  .extend(integerId)
  .extend(object)
  .extend(objectId)
  .extend(string)
  .extend(hostname)
  .extend(htmlExpanded)
  .extend(htmlFull)
  .extend(htmlLimited)
  .extend(slug);
