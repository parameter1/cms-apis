const isRequired = (helpers) => {
  const presence = helpers.schema.$_getFlag('presence');
  return presence === 'required';
};

export default (joi) => ({
  type: 'str',
  // always trim and allow null and empty strings
  base: joi.string().trim().allow(null, ''),
  prepare(value) {
    // return null-like values as strings
    return { value: value == null ? '' : value };
  },
  coerce(value, helpers) {
    // return error on non-strings
    if (typeof value !== 'string') return { errors: helpers.error('string.base') };
    const required = isRequired(helpers);

    // after value is trimmed, always return null when empty
    // if also required, error when empty
    return {
      value: value || null,
      ...(required && !value && { errors: helpers.error('any.required') }),
    };
  },
});
