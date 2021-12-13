import { dasherize, underscore } from 'inflected';
import { DB } from '@cms-apis/db';
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

  const resource = DB.resourceMap().get(repoName);
  if (!resource) throw new Error(`No database resource found for model repo ${repoName}`);

  const isPolymorphic = Boolean(resource.get('types'));
  const subTypes = isPolymorphic ? new Set(resource.get('types').toJS()) : null;

  const hasSubTypePath = (type) => {
    if (!isPolymorphic) return false;
    return subTypes.has(underscore(type).toUpperCase());
  };

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
     * @returns {boolean}
     */
    getIsPolymorphic: () => isPolymorphic,

    /**
     *
     * @returns {string}
     */
    getPolymorphicTypeFor: (doc) => {
      if (!isPolymorphic) return restType;
      if (!doc._type) throw new Error(`The ${restType} model is listed as polymorphic but no linkage type was found.`);
      return `${restType}/${dasherize(doc._type.toLowerCase())}`;
    },

    /**
     *
     * @returns {object}
     */
    getMeta: () => meta,

    /**
     *
     * @returns {string}
     */
    getPath: () => (isPolymorphic ? `/${restType}/:subtype([a-z-]+)` : `/${restType}`),

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

    getSubTypes: () => subTypes,

    /**
     *
     * @returns {string[]}
     */
    getQueryNames: () => queryNames,

    /**
     *
     * @param {string} type
     * @returns {boolean}
     */
    hasSubTypePath,

    isValidRestType: (type) => {
      if (!isPolymorphic) return restType === type;
      const subType = type.split('/').pop();
      return type.startsWith(type) && hasSubTypePath(subType);
    },

    get [Symbol.toStringTag]() {
      return 'RESTModel';
    },
  };
};
