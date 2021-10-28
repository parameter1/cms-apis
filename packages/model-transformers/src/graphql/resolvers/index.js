import merge from 'lodash.merge';

export default merge({
  /**
   *
   */
  Query: {
    /**
     *
     */
    contentById(_, { input }, { dbs }) {
      const { id } = input;
      return dbs.legacy.repo('platform.Content').findById({ id });
    },

    /**
     *
     */
    ping() {
      return 'pong';
    },
  },

  /**
   *
   */
  Content: {
    _type(content) {
      return content.type;
    },
  },
});
