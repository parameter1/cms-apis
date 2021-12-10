import Joi from '@cms-apis/joi';
import { limited as limitedHtml } from '../html.js';

export default {
  id: Joi.objectId(),
  name: limitedHtml,
  slug: Joi.slug(),
};
