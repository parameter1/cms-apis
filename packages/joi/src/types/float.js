import { getDefaultValue, isRequired } from './utils/index.js';

export default (joi) => ({
  type: 'float',
  base: joi.number().allow(null),
  prepare(value, helpers) {
    // handle default value
    const defaultValue = getDefaultValue(helpers);
    const v = value == null ? defaultValue : value;

    // return null-like values as strings
    return { value: v == null ? null : v };
  },
  coerce(value, helpers) {
    const required = isRequired(helpers);
    return {
      value,
      ...(required && value == null && { errors: helpers.error('any.required') }),
    };
  },
});
