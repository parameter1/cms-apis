const resolveType = async ({ type }) => `Content${type}`;

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
