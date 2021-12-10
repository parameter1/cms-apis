import clean from '@cms-apis/clean-string';
import { getAsArray } from '@cms-apis/object-path';
import { getDefaultValue, isRequired } from './utils/index.js';

export default (joi) => ({
  type: 'str',
  // always trim and allow null and empty strings
  base: joi.string().trim().allow(null, ''),
  prepare(value, helpers) {
    // handle default value
    const defaultValue = getDefaultValue(helpers);
    const v = value == null ? defaultValue : value;

    // return null-like values as strings
    return { value: v == null ? '' : v };
  },
  coerce(value, helpers) {
    // return error on non-strings
    if (typeof value !== 'string') return { errors: helpers.error('string.base') };
    const required = isRequired(helpers);

    const defaultValue = getDefaultValue(helpers);
    const v = value || defaultValue;

    // after value is trimmed, try default again when empty, otherwise always return null
    // if also required, error when empty
    return {
      value: v || null,
      ...(required && !v && { errors: helpers.error('any.required') }),
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
