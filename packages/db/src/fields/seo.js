import Joi from '@cms-apis/joi';

export default {
  canonicalUrl: Joi.string().uri({ scheme: ['http', 'https'], domain: { tlds: { allow: true } } }),
  description: Joi.string(),
  title: Joi.string(),
};
