import { LegacyDB } from '@cms-apis/db';
import mapObject, { mapObjectSkip } from 'map-obj';
import sortKeys from 'sort-keys';

export default (node) => sortKeys(mapObject(node, (key, value) => {
  if (key === '__typename') return mapObjectSkip;
  if (key === 'id') return [key, LegacyDB.coerceId(value), { shouldRecurse: false }];
  return [key, value];
}, { deep: true }), { deep: true });
