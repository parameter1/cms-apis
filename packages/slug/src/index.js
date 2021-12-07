import slug from 'slug';
import { isFunction, isObject, trim } from '@cms-apis/utils';

slug.extend({
  '/': '-',
  '\\': '-',
  _: '-',
  '-': '-',
  '&': 'and',
});

export default (value, options) => {
  if (!value) return null;
  if (isObject(value)) throw new Error('Object values cannot be sluggified');
  if (isFunction(value)) throw new Error('Function values cannot be sluggified');
  const trimmed = trim(Array.isArray(value) ? value.join('-') : value);
  if (!trimmed) return null;

  const sluggified = slug(trimmed, options);

  // remove repetitive dashes
  const repetitiveRemoved = sluggified.replace(/-{2,}/g, '-');
  // strip leading and trailing dashes
  const dashesTrimmed = repetitiveRemoved.replace(/^-+/, '').replace(/-+$/, '');
  // return null when empty
  return dashesTrimmed || null;
};
