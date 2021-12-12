import Joi from '@cms-apis/joi';

export default {
  id: Joi.objectId(),
  description: Joi.string(),
  name: Joi.string(),
};
