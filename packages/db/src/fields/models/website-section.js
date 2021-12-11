import Joi from '@cms-apis/joi';
import seoFields from '../seo.js';
import sequence from '../sequence.js';

export default {
  id: Joi.integerId(),
  description: Joi.fullHtml(),
  name: Joi.limitedHtml(),
  seo: Joi.object({
    ...seoFields,
  }).collapsible().default(null),
  sequence,
  slug: Joi.slug(),
};
