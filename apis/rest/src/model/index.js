import { LegacyDB } from '@cms-apis/db';
import createByIdQueryOp from './create-by-id-query-op.js';
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
    loadOne: async ({ graphql, id } = {}) => {
      const type = graphQLTypeObj.name;
      const queryName = queryNames.get('ONE');
      if (!queryName) throw new Error(`Unable to find load one query name for ${type}`);

      const input = { id: LegacyDB.coerceId(id) };
      const query = createByIdQueryOp({
        idType,
        type,
        attributes,
        relationships,
        queryName,
      });
      const { data } = await graphql.query({ query, variables: { input } });
      return data[queryName];
    },

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

    get [Symbol.toStringTag]() {
      return 'RESTModel';
    },
  };
};
