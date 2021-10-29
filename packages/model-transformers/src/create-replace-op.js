import { LegacyDB } from '@cms-apis/db';
import mapObject, { mapObjectSkip } from 'map-obj';

export default (transformed) => {
  const filter = { _id: LegacyDB.coerceId(transformed._id) };
  const replacement = mapObject(transformed, (key, value) => {
    if (key === '__typename') return mapObjectSkip;
    if (key === '_id') return [key, LegacyDB.coerceId(value), { shouldRecurse: false }];
    return [key, value];
  }, { deep: true });
  return { replaceOne: { filter, replacement, upsert: true } };
};
