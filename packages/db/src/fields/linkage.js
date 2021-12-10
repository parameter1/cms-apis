import Joi from '@cms-apis/joi';
import integerId from './integer-id.js';
import objectId from './object-id.js';

export const oidLinkage = Joi.object({
  id: objectId.required(),
  type: Joi.string(),
});

export const oidArrayLinkage = Joi.array().items(oidLinkage).default([]);

export const intLinkage = Joi.object({
  id: integerId.required(),
  type: Joi.string(),
});

export const intArrayLinkage = Joi.array().items(intLinkage).default([]);
