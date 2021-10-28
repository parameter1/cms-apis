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
    contentInterfaceById(_, { input }, { dbs }) {
      const { id } = input;
      return dbs.legacy.repo('platform.Content').findById({ id });
    },
  },
};
