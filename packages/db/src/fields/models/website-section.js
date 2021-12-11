import Joi from '@cms-apis/joi';
import sequence from '../sequence.js';

export default {
  id: Joi.integerId(),
  description: Joi.fullHtml(),
  name: Joi.limitedHtml(),
  seo: Joi.object({
    canonicalUrl: Joi.string().uri({ scheme: ['http', 'https'], domain: { tlds: { allow: true } } }),
    description: Joi.string(),
    title: Joi.string(),
  }).collapsible().default(null),
  sequence,
  slug: Joi.slug(),
};
