const pattern = /[0-9a-f]{24}/;

export default (ObjectId) => (joi) => ({
  type: 'objectId',
  base: joi.any(),
  messages: {
    'objectId.base': '{{#label}} must be an ObjectId',
  },
  validate(value, helpers) {
    if (value instanceof ObjectId) return { value };
    if (pattern.test(value)) return { value: ObjectId.createFromHexString(value) };
    if (typeof value === 'object' && pattern.test(`${value}`)) return { value: ObjectId.createFromHexString(`${value}`) };
    return { value, errors: helpers.error('objectId.base') };
  },
});
