import Joi from '@cms-apis/joi';

export const full = Joi.str().html().multiline();
export const expanded = Joi.str().html({ tags: ['br', 'a', 'i', 'b', 'em', 'strong', 'del', 's'] });
export const limited = Joi.str().html({ tags: ['i', 'b', 'em', 'strong', 'del', 's'] });
