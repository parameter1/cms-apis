import getDefaultValue from './get-default-value.js';
import isRequired from './is-required.js';

export default (value, helpers, onNullish = null) => {
  // handle default value
  const defaultValue = getDefaultValue(helpers);
  const v = value == null ? defaultValue : value;

  // return consistent null and check required
  return {
    value: v == null ? onNullish : v,
    ...(isRequired(helpers) && value == null && { errors: helpers.error('any.required') }),
  };
};
