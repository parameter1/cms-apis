export default ({
  restType,
  repoName,
  path,
  meta,
  attrs,
  links,
  graphQLTypeObj,
}) => ({
  getRestType: () => restType,
  getRepoName: () => repoName,
  getPath: () => path,
  getMeta: () => meta,
  getAttributes: () => attrs,
  getRelationships: () => links,
  getGraphQLTypeObj: () => graphQLTypeObj,

  findOneById: () => {
    console.log('findOneById');
    throw new Error('NYI');
  },
});
