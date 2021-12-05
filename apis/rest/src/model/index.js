import createModelMeta from '../utils/create-model-meta.js';

/**
 * @param {object} params
 * @param {string} params.idType The identifier type, e.g. Int or ObjectID
 * @param {string} params.restType The model's rest type, e.g. website/section
 * @param {string} params.repoName The model's database repose name, e.g. website-sections
 * @param {GraphQLObjectType} params.graphQLTypeObj The corresponse type object
 * @param {Map} params.attributes The model attribute map
 * @param {Map} params.relationships The model relationship map
 * @param {Map} params.queryNames A map of query names for ONE and MANY operations
 */
export default ({
  idType,
  restType,
  repoName,
  graphQLTypeObj,
  attributes,
  relationships,
  queryNames,
} = {}) => {
  const meta = createModelMeta(restType);
  return {
    /**
     *
     * @returns {Map}
     */
    getAttributes: () => attributes,

    /**
     *
     * @returns {GraphQLObjectType}
     */
    getGraphQLTypeObj: () => graphQLTypeObj,

    /**
     *
     * @returns {string}
     */
    getIDType: () => idType,

    /**
     *
     * @returns {object}
     */
    getMeta: () => meta,

    /**
     *
     * @returns {string}
     */
    getPath: () => `/${restType}`,

    /**
     *
     * @returns {Map}
     */
    getRelationships: () => relationships,

    /**
     *
     * @returns {string}
     */
    getRepoName: () => repoName,

    /**
     *
     * @returns {string}
     */
    getRestType: () => restType,

    /**
     *
     * @returns {string[]}
     */
    getQueryNames: () => queryNames,

    get [Symbol.toStringTag]() {
      return 'RESTModel';
    },
  };
};
