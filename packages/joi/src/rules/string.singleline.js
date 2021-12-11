export default (joi) => ({
  type: 'string',
  base: joi.string(),
  rules: {
    singleline: {
      validate(value) {
        if (!value || typeof value !== 'string') return value;
        return value.trim().replace(/[\r\n]/g, '__NEW-LINE__')
          .split('__NEW-LINE__')
          .map((l) => l.trim())
          .filter((l) => l)
          .join(' ')
          .trim();
      },
    },
  },
});
