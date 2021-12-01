import { get, getAsArray } from '@cms-apis/object-path';

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
      return 'website/section';
    },
  },

  /**
   *
   */
  WebsiteSectionLinks: {
    children(section) {
      const linkage = getAsArray(section, '_connection.descendants')
        .filter((edge) => edge && edge.depth === 1 && edge.node)
        .map((edge) => edge.node._id)
        .sort()
        .map((id) => ({ id, type: 'website/section' }));
      return { linkage };
    },
    coverImage(section) {
      const id = get(section, '_edge.coverImage.node._id');
      const linkage = id ? { id, type: 'platform/asset/image' } : null;
      return { linkage };
    },
    logo(section) {
      const id = get(section, '_edge.logo.node._id');
      const linkage = id ? { id, type: 'platform/asset/image' } : null;
      return { linkage };
    },
    options() {
      return { linkage: [] };
    },
    parent(section) {
      const id = get(section, '_edge.parent.node._id');
      const linkage = id ? { id, type: 'website/section' } : null;
      return { linkage };
    },
    relatedSections(section) {
      const linkage = getAsArray(section, '_connection.related')
        .filter((edge) => edge && edge.node)
        .map((edge) => edge.node._id)
        .sort()
        .map((id) => ({ id, type: 'website/section' }));
      return { linkage };
    },
    relatedTaxonomy() {
      return { linkage: [] };
    },
    self(section, _, { linkBuilder }) {
      return linkBuilder.self({ id: section._id, type: 'website/section' });
    },
    site(section) {
      const id = get(section, '_edge.website.node._id');
      const linkage = id ? { id, type: 'website/product/site' } : null;
      return { linkage };
    },
  },
};
