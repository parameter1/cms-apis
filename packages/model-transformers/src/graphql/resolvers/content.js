import { get } from '@cms-apis/object-path';
import { trim } from '@cms-apis/utils';
import { LegacyDB } from '@cms-apis/db';
import { formatStatus } from '../utils/index.js';

const resolveType = async ({ type }) => `Content${type}`;

const getMutatedValue = ({ content, mutation, field }) => {
  const value = get(content, `mutations.${mutation}.${field}`);
  return trim(value);
};

export default {
  /**
   *
   */
  ContentInterface: {
    __resolveType: resolveType,
    body(content) {
      return {
        default: trim(content.body),
        email: getMutatedValue({ content, mutation: 'Email', field: 'body' }),
        magazine: getMutatedValue({ content, mutation: 'Magazine', field: 'body' }),
        website: getMutatedValue({ content, mutation: 'Website', field: 'body' }),
      };
    },
    name(content) {
      return {
        default: trim(content.name),
        email: getMutatedValue({ content, mutation: 'Email', field: 'name' }),
        magazine: getMutatedValue({ content, mutation: 'Magazine', field: 'name' }),
        website: getMutatedValue({ content, mutation: 'Website', field: 'name' }),
      };
    },
    async primaryWebsiteSectionEdge(content, _, { loaders }) {
      const id = LegacyDB.extractRefIdFromPath(content, 'mutations.Website.primarySection');
      if (!id) throw new Error(`Unable to load a primary section ID for content ID ${content._id}`);
      const node = await loaders.get('website.Section').load(id);
      return { node };
    },
    status({ status }) {
      return formatStatus(status);
    },
    teaser(content) {
      return {
        default: trim(content.teaser),
        email: getMutatedValue({ content, mutation: 'Email', field: 'teaser' }),
        magazine: getMutatedValue({ content, mutation: 'Magazine', field: 'teaser' }),
        website: getMutatedValue({ content, mutation: 'Website', field: 'teaser' }),
      };
    },
  },

  /**
   *
   */
  Query: {
    /**
     *
     */
    contentInterfaceById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('platform.Content').load(id);
    },
  },
};
