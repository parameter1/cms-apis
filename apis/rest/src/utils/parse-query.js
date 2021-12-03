import createError from 'http-errors';
import { get } from '@cms-apis/object-path';

export default (query, model) => {
  const attributes = model.getAttributes();
  const limit = parseInt(query.limit, 10);
  const skip = parseInt(query.skip, 10);
  const parsed = {
    fields: new Set((query.fields || '').split(',').map((v) => v.trim()).filter((v) => v)),
    include: new Set((query.include || '').split(',').map((v) => v.trim()).filter((v) => v)),
    exclude: new Set((get(query, 'filter.exclude') || '').split(',').map((v) => v.trim()).filter((v) => v)),
    limit: limit > 0 ? limit : 50,
    skip: skip > 0 ? skip : 0,
    sort: (query.sort || '').split(',').reduce((arr, field) => {
      const pattern = /^-/;
      const trimmed = field.trim();
      if (!trimmed) return arr;

      const order = pattern.test(trimmed) ? 'DESC' : 'ASC';
      const attr = attributes.get(trimmed.replace(pattern, ''));
      if (!attr) return arr;
      arr.push({ field: attr.dbFieldName, order });
      return arr;
    }, []),
  };

  if (parsed.include.size && parsed.fields.size) {
    // ensure included/sideloaded values are also in the projection
    parsed.include.forEach((field) => parsed.fields.add(field));
  }

  if (parsed.fields.size && parsed.exclude.size) {
    // @see https://github.com/parameter1/base-platform/blob/0fd030927a06196b86b74894f60e5ee7b2317463/src/Cygnus/ModlrBundle/ApiNext/Resource/Persistence/Resource.php#L375
    throw createError(400, 'You cannot both include and exclude fields when querying the database.');
  }
  return parsed;
};
