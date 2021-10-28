import { get } from '@cms-apis/object-path';

const resolveType = async ({ type }) => `Content${type}`;

const getMutatedValue = ({ content, mutation, field }) => {
  const value = get(content, `mutations.${mutation}.${field}`);
  if (!value) return null;
  return value.trim() || null;
};

export default {
  /**
   *
   */
  ContentInterface: {
    /**
     *
     */
    __resolveType: resolveType,

    /**
     *
     */
    _type(content) {
      return content.type;
    },

    /**
     *
     */
    body(content) {
      return content;
    },

    /**
     *
     */
    name(content) {
      return content;
    },

    /**
     *
     */
    teaser(content) {
      return content;
    },
  },

  /**
   *
   */
  ContentInterfaceBody: {
    default({ body }) {
      return (body || '').trim() || null;
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
      return (name || '').trim();
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
      return (teaser || '').trim() || null;
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
