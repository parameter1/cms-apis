import { pluralize } from 'inflected';
import { LegacyDB } from '@cms-apis/db';
import createModelMeta from '../utils/create-model-meta.js';

export default ({
  emberType,
  findById = {},
} = {}) => {
  const parts = emberType.split('/');
  const path = `/${emberType}`;
  const meta = createModelMeta(emberType);
  const collectionName = `${parts[0]}-${pluralize(parts[1])}`;

  return {
    getEmberType: () => emberType,
    getPath: () => path,
    getMeta: () => meta,
    getCollectionName: () => collectionName,

    findOneById: async ({ graphql, id } = {}) => {
      const input = { id: LegacyDB.coerceId(id) };
      const { data } = await graphql.query({ query: findById.query, variables: { input } });
      return data[findById.resultKey];
    },
  };
};
