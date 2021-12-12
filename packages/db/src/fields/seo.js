import Joi from '@cms-apis/joi';
import url from './url.js';

export default {
  canonicalUrl: url,
  description: Joi.string(),
  title: Joi.string(),
};
