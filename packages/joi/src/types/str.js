import clean from '@cms-apis/clean-string';
import { getAsArray } from '@cms-apis/object-path';

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
  validate(value, helpers) {
    let v = value;
    if (!helpers.schema.$_getRule('html')) {
      // no html rule set. strip all tags
      // @todo only deconding entities because platform was; re-examine
      v = clean(v, { stripHtmlTags: true, decodeEntities: true });
    }

    if (!helpers.schema.$_getFlag('multiline')) {
      // strip multi-line fields when multiline isn't set
      v = v.replace(/[\r\n]/g, '__NEW-LINE__')
        .split('__NEW-LINE__')
        .map((l) => l.trim())
        .filter((l) => l)
        .join(' ');
    }
    return { value: v };
  },
  rules: {
    html: {
      args: [
        {
          name: 'params',
          assert: joi.object({
            tags: joi.array().items(joi.string().trim()).default([]),
          }),
        },
      ],
      method(params) {
        return this.$_addRule({ name: 'html', args: { params } });
      },
      validate(value, helpers, { params }) {
        const tags = getAsArray(params, 'tags');
        // @todo only deconding entities because platform was; re-examine
        return clean(value, { stripHtmlTags: tags.length ? tags : false, decodeEntities: true });
      },
    },
    multiline: {
      method() {
        return this.$_setFlag('multiline', true);
      },
    },
  },
});
