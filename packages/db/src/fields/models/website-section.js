import Joi from '@cms-apis/joi';
import { limited as limitedHtml } from '../html.js';
import integerId from '../integer-id.js';

export default {
  id: integerId,
  name: limitedHtml,
  slug: Joi.slug(),
};
