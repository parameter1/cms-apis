import { get } from '@cms-apis/object-path';
import { trim } from '@cms-apis/utils';

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
    _type(content) {
      return trim(content.type);
    },
    body(content) {
      return content;
    },
    name(content) {
      return content;
    },
    async primaryWebsiteSectionEdge(content, _, { loaders }) {
      const node = await loaders.get('website.Section').load(get(content, 'mutations.Website.primarySection.oid'));
      return { node };
    },
    teaser(content) {
      return content;
    },
  },

  /**
   *
   */
  ContentInterfaceBody: {
    default({ body }) {
      return trim(body);
    },
    email(content) {
      return getMutatedValue({ content, mutation: 'Email', field: 'body' });
    },
    magazine(content) {
      return getMutatedValue({ content, mutation: 'Magazine', field: 'body' });
    },
    website(content) {
      return getMutatedValue({ content, mutation: 'Website', field: 'body' });
    },
  },

  /**
   *
   */
  ContentInterfaceName: {
    default({ name }) {
      return trim(name);
    },
    email(content) {
      return getMutatedValue({ content, mutation: 'Email', field: 'name' });
    },
    magazine(content) {
      return getMutatedValue({ content, mutation: 'Magazine', field: 'name' });
    },
    website(content) {
      return getMutatedValue({ content, mutation: 'Website', field: 'name' });
    },
  },

  /**
   *
   */
  ContentInterfaceTeaser: {
    default({ teaser }) {
      return trim(teaser);
    },
    email(content) {
      return getMutatedValue({ content, mutation: 'Email', field: 'teaser' });
    },
    magazine(content) {
      return getMutatedValue({ content, mutation: 'Magazine', field: 'teaser' });
    },
    website(content) {
      return getMutatedValue({ content, mutation: 'Website', field: 'teaser' });
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
