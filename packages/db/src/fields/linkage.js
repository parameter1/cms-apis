import Joi from '@cms-apis/joi';
import integerId from './integer-id.js';
import objectId from './object-id.js';

const oidLinkage = Joi.object({
  id: objectId.required(),
  type: Joi.string(),
});

const intLinkage = Joi.object({
  id: integerId.required(),
  type: Joi.string(),
});

export default {
  oidLinkage,
  oidArrayLinkage: Joi.array().items(oidLinkage).default([]),
  intLinkage,
  intArrayLinkage: Joi.array().items(intLinkage).default([]),
};
