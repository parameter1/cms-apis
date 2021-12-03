import { LegacyDB } from '@cms-apis/db';
import createFindByIdQuery from './create-find-by-id-query.js';
import createLoadManyQuery from './create-load-many-query.js';
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
     * @todo Eventually create a true "loader" action that uses DLs
     * @todo Prime the DL with the response (if found)
     *
     * @param {object} params
     * @param {object} params.graphql The GraphQL client
     * @param {number|ObjectId} params.id The ID to query for
     * @param {boolean} [params.withLinkUrls=true] Whether links should include URLs
     * @param {boolean} [params.withLinkage=true] Whether links should linkage objects
     * @returns {Promise<object?>}
     */
    findById: async ({
      graphql,
      id,
      withLinkUrls = true,
      withLinkage = true,
    } = {}) => {
      const type = graphQLTypeObj.name;
      const queryName = queryNames.get('FIND_BY_ID');
      if (!queryName) throw new Error(`Unable to extract a FIND_BY_ID query name for ${type}`);

      const input = { id: LegacyDB.coerceId(id) };
      const query = createFindByIdQuery({
        type,
        attributes,
        relationships,
        queryName,
        withLinkUrls,
        withLinkage,
      });
      const { data } = await graphql.query({ query, variables: { input } });
      return data[queryName];
    },

    /**
     *
     * @param {object} params
     * @param {object} params.graphql The GraphQL client
     * @param {number[]|ObjectId[]} params.ids The IDs to query for using dataloader
     * @param {boolean} [params.withLinkUrls=true] Whether links should include URLs
     * @param {boolean} [params.withLinkage=true] Whether links should linkage objects
     * @returns {Promise<object?>}
     */
    loadMany: async ({
      graphql,
      ids,
      withLinkUrls = true,
      withLinkage = true,
    } = {}) => {
      const type = graphQLTypeObj.name;
      const queryName = queryNames.get('LOAD_MANY');
      if (!queryName) throw new Error(`Unable to extract a LOAD_MANY query name for ${type}`);

      const input = { ids };
      const query = createLoadManyQuery({
        type,
        attributes,
        relationships,
        queryName,
        withLinkUrls,
        withLinkage,
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
