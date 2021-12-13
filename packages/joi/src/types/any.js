import prepareValue from './utils/prepare-value.js';

export default (joi) => ({
  type: 'any',
  base: joi.any().allow(null),
  prepare(value, helpers) {
    return prepareValue(value, helpers);
  },
  rules: {
    requiredWhenDefined: {
      method() {
        return this.$_setFlag('requiredWhenDefined', true);
      },
    },
  },
});
