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
      query.resolve = (_, { input }, { db }) => {
        const repo = db.repo($meta.repoName);
        return repo.findById({ id: input.id });
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
  });
};
