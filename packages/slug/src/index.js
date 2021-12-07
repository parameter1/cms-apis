import slug from 'slug';

slug.extend({
  '/': '-',
  _: '-',
  '&': 'and',
});

export default (value, options) => {
  const sluggified = slug(value, options);
  return sluggified.replace(/-{2,}/g, '-');
};
