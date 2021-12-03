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
      query.resolve = (_, { input }, { loaders }) => {
        const loader = loaders.get($meta.repoName);
        return loader.load({ value: input.id });
      };
    }
    if (kind === 'FIND') {
      query.resolve = (_, { input }, { db }) => {
        const repo = db.repo($meta.repoName);
        const { ids } = input;
        const criteria = {
          ...(ids.length && { _id: { $in: ids } }),
        };
        return repo.find({ query: criteria });
      };
    }
    if (kind === 'LOAD_MANY') {
      query.resolve = async (_, { input }, { loaders }) => {
        const loader = loaders.get($meta.repoName);
        const { ids } = input;
        const docs = ids.length ? await loader.loadMany({ values: ids }) : [];
        return docs.filter((doc) => doc); // prevent null nodes
      };
    }
  });
};
