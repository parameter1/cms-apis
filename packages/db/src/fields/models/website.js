import Joi from '@cms-apis/joi';
import objectId from '../object-id.js';

export default {
  id: objectId,
  name: Joi.str(),
};
