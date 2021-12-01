import { pluralize } from 'inflected';

import createModelMeta from '../utils/create-model-meta.js';

const modelTypes = new Set([
  'website/section',
]);

const map = new Map();
modelTypes.forEach((emberType) => {
  const parts = emberType.split('/');

  map.set(emberType, {
    emberType,
    path: `/${emberType}`,
    meta: createModelMeta(emberType),

    collection: `${parts[0]}-${pluralize(parts[1])}`,
  });
});

export default map;
