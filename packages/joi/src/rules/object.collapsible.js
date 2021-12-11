export default (joi) => ({
  type: 'object',
  base: joi.object(),
  rules: {
    collapsible: {
      validate(value) {
        if (!value || typeof value !== 'object') {
          return value;
        }
        const empty = Object.keys(value).every((key) => value[key] == null);
        if (empty) return undefined;
        return value;
      },
    },
  },
});
