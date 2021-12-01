import { getAsArray } from '@cms-apis/object-path';

export default {
  /**
   *
   */
  Query: {
    /**
     *
     */
    websiteSectionById(_, { input }, { db }) {
      return db.repo('website-sections').findById({ id: input.id });
    },
  },

  /**
   *
   */
  WebsiteSection: {
    descendantIds(section) {
      return getAsArray(section, '_connection.descendants').reduce((arr, desc) => {
        arr.push(desc.node._id);
        return arr;
      }, [section._id]).sort();
    },
    id(section) {
      return section._id;
    },
    type() {
      return 'website/section';
    },
  },
};
