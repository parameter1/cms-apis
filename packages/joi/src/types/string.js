import clean from '@cms-apis/clean-string';
import { getAsArray } from '@cms-apis/object-path';
import prepareValue from './utils/prepare-value.js';

export default (joi) => ({
  type: 'string',
  base: joi.string().trim().allow(null, ''),
  prepare(value, helpers) {
    return prepareValue(value, helpers, '');
  },
  coerce(value, helpers) {
    // return error on non-strings
    if (typeof value !== 'string') return { errors: helpers.error('string.base') };
    // convert empty strings to null and handle defaults/required
    return prepareValue(value || null, helpers);
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
        .join(' ')
        .trim();
    }
    return { value: v };
  },
  rules: {
    requiredWhenDefined: {
      method() {
        return this.$_setFlag('requiredWhenDefined', true);
      },
    },
    html: {
      args: [
        {
          name: 'params',
          assert: joi.object({
            preset: joi.string(),
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
