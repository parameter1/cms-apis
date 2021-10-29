import { LegacyDB } from '@cms-apis/db';
import mapObject, { mapObjectSkip } from 'map-obj';

export default (node) => mapObject(node, (key, value) => {
  if (key === '__typename') return mapObjectSkip;
  if (key === '_id') return [key, LegacyDB.coerceId(value), { shouldRecurse: false }];
  return [key, value];
}, { deep: true });
