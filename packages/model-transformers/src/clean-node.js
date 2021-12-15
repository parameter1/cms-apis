import { DB, cleanDocument, mapObjectSkip } from '@cms-apis/db';

export default (node) => cleanDocument(node, {
  mapper: (key, value) => {
    if (key === '__typename') return mapObjectSkip;
    if (key === '_id') return [key, DB.coerceId(value), { shouldRecurse: false }];
    return undefined;
  },
});
