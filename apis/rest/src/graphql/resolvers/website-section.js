import { getAsArray } from '@cms-apis/object-path';

export const TYPE = 'website/section';

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
    links(section) {
      return section;
    },
    type() {
      return TYPE;
    },
  },

  /**
   *
   */
  WebsiteSectionLinks: {
    self(section, _, { linkBuilder }) {
      return linkBuilder.self({ id: section._id, type: TYPE });
    },
  },
};
