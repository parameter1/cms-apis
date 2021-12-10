import Joi from '@cms-apis/joi';

export default {
  id: Joi.objectId(),
  name: Joi.str(),
};
