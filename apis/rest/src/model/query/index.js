import { LegacyDB } from '@cms-apis/db';
import createFindQuery from './create-find-query.js';
import createFindByIdQuery from './create-find-by-id-query.js';
import createLoadManyQuery from './create-load-many-query.js';
import cleanNode from '../../utils/clean-node.js';

export default ({
  model,
  graphql,
} = {}) => {
  const { name: type } = model.getGraphQLTypeObj();
  const queryNames = model.getQueryNames();

  return {
    /**
    *
    * @param {object} params
    * @param {object} params.graphql The GraphQL client
    * @param {paginaton} params.pagination
    * @param {number} params.pagination.limit
    * @param {number} params.pagination.skip
    * @param {boolean} [params.withLinkUrls=true] Whether links should include URLs
    * @param {boolean} [params.withLinkage=true] Whether links should linkage objects
    * @returns {Promise<object?>}
    */
    find: async ({
      pagination,
      fields,
      sort,
      withLinkUrls = true,
      withLinkage = true,
    } = {}) => {
      const queryName = queryNames.get('FIND');
      if (!queryName) throw new Error(`Unable to extract a FIND query name for ${type}`);

      const input = { pagination, sort };

      // pass included/excluded links fields here...
      // this should remove the linkage, where applicable, then sideload will ignore
      const query = createFindQuery({
        type,
        attributes: model.getAttributes(),
        relationships: model.getRelationships(),
        selected: fields,
        queryName,
        withLinkUrls,
        withLinkage,
      });
      const { data } = await graphql.query({ query, variables: { input } });
      return data[queryName].map(cleanNode);
    },

    /**
     *
     * @param {object} params
     * @param {object} params.graphql The GraphQL client
     * @param {number|ObjectId} params.id The ID to query for
     * @param {boolean} [params.withLinkUrls=true] Whether links should include URLs
     * @param {boolean} [params.withLinkage=true] Whether links should linkage objects
     * @returns {Promise<object?>}
     */
    findById: async ({
      id,
      fields,
      withLinkUrls = true,
      withLinkage = true,
    } = {}) => {
      const queryName = queryNames.get('FIND_BY_ID');
      if (!queryName) throw new Error(`Unable to extract a FIND_BY_ID query name for ${type}`);

      const input = { id: LegacyDB.coerceId(id) };
      const query = createFindByIdQuery({
        type,
        attributes: model.getAttributes(),
        relationships: model.getRelationships(),
        selected: fields,
        queryName,
        withLinkUrls,
        withLinkage,
      });
      const { data } = await graphql.query({ query, variables: { input } });
      const node = data[queryName];
      return node ? cleanNode(node) : null;
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
      ids,
      withLinkUrls = true,
      withLinkage = true,
    } = {}) => {
      const queryName = queryNames.get('LOAD_MANY');
      if (!queryName) throw new Error(`Unable to extract a LOAD_MANY query name for ${type}`);

      const input = { ids };
      const query = createLoadManyQuery({
        type,
        attributes: model.getAttributes(),
        relationships: model.getRelationships(),
        queryName,
        withLinkUrls,
        withLinkage,
      });
      const { data } = await graphql.query({ query, variables: { input } });
      return data[queryName].map(cleanNode);
    },
  };
};
