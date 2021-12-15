import Joi from '@cms-apis/joi';

export default {
  id: Joi.objectId(),
  abbreviation: Joi.string(),
  assetHost: Joi.hostname(),
  imageHost: Joi.hostname(),
  host: Joi.hostname(),
  description: Joi.string(),
  name: Joi.string(),
};
