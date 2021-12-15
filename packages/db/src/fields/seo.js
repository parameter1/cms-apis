import Joi from '@cms-apis/joi';

export default {
  canonicalUrl: Joi.url(),
  description: Joi.string(),
  title: Joi.string(),
};
