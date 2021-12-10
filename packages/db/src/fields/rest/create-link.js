import Joi from '@cms-apis/joi';

export default (linkage) => Joi.object({
  linkage,
}).unknown();
