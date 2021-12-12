import Joi from '@cms-apis/joi';

export default {
  id: Joi.integerId(),
  description: Joi.string(),
  name: Joi.string(),
  slug: Joi.slug(),
};
