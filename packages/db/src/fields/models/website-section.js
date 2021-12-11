import Joi from '@cms-apis/joi';
import integerId from '../integer-id.js';
import { limited as limitedHtml, full as fullHtml } from '../html.js';

export default {
  id: integerId,
  description: fullHtml,
  name: limitedHtml,
  slug: Joi.slug(),
};
