import { ObjectId } from '@cms-apis/mongodb';
import { isRequired } from './utils/index.js';

const pattern = /[0-9a-f]{24}/i;

export default (joi) => ({
  type: 'objectId',
  base: joi.any().allow(null),
  messages: {
    'objectId.base': '{{#label}} must be an ObjectId',
  },
  prepare(value, helpers) {
    const required = isRequired(helpers);
    return {
      value,
      ...(required && value == null && { errors: helpers.error('any.required') }),
    };
  },
  coerce(value) {
    if (value instanceof ObjectId) return { value };
    if (pattern.test(`${value}`)) return { value: ObjectId.createFromHexString(`${value}`) };
    if (value == null) return { value: null };
    return { value: false };
  },
  validate(value, helpers) {
    return {
      value,
      ...(!value && { errors: helpers.error('objectId.base') }),
    };
  },
});
