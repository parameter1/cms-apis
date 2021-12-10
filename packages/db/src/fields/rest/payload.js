import Joi from '@cms-apis/joi';

export default (obj) => Joi.object(obj).unknown().required();
