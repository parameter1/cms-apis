import getProjection from './get-projection.js';

/* eslint-disable no-param-reassign */
export default (schema) => {
  const { Query } = schema.getTypeMap();
  Object.values(Query.getFields()).forEach((query) => {
    const { astNode } = query;
    if (!astNode || !astNode.$query) return;
    const { kind, returnType } = astNode.$query;

    const type = schema.getType(returnType);
    if (!type || !type.astNode || !type.astNode.$meta) return;

    if (!type.astNode.$queryNames) type.astNode.$queryNames = new Map();
    type.astNode.$queryNames.set(kind, query.name);

    const { $meta } = type.astNode;
    if (kind === 'FIND_BY_ID') {
      query.resolve = (_, { input }, { loaders }, info) => {
        const projection = getProjection(info);
        const loader = loaders.get($meta.repoName);
        return loader.load({ value: input.id, projection });
      };
    }
    if (kind === 'FIND') {
      query.resolve = async (_, { input }, { db }, info) => {
        const projection = getProjection(info);
        const repo = db.repo($meta.repoName);
        const { pagination, sort } = input;
        const criteria = {};
        const options = {
          projection,
          limit: pagination.limit,
          skip: pagination.skip,
          sort: sort.length ? sort.reduce((o, { field, order }) => {
            const dir = order === 'ASC' ? 1 : -1;
            return { ...o, [field]: dir };
          }, {}) : undefined,
        };
        const cursor = await repo.find({ query: criteria, options });
        return cursor.toArray();
      };
    }
    if (kind === 'LOAD_MANY') {
      query.resolve = async (_, { input }, { loaders }, info) => {
        const projection = getProjection(info);
        const loader = loaders.get($meta.repoName);
        const { ids } = input;
        const docs = ids.length ? await loader.loadMany({ values: ids, projection }) : [];
        return docs.filter((doc) => doc); // prevent null nodes
      };
    }
  });
};
