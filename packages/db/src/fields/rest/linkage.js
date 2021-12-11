import Joi from '@cms-apis/joi';

export const oidLinkage = Joi.object({
  id: Joi.objectId().required(),
  type: Joi.string(),
});

export const oidArrayLinkage = Joi.array().items(oidLinkage).default([]);

export const intLinkage = Joi.object({
  id: Joi.integerId().required(),
  type: Joi.string(),
});

export const intArrayLinkage = Joi.array().items(intLinkage).default([]);
