import { get, getAsArray } from '@cms-apis/object-path';

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
    children(section, _, { linkBuilder }) {
      const linkage = getAsArray(section, '_connection.descendants')
        .filter((edge) => edge && edge.depth === 1 && edge.node)
        .map((edge) => edge.node._id)
        .sort()
        .map((id) => ({ id, type: 'website/section' }));
      return { linkage, ...linkBuilder.linkage({ id: section._id, type: TYPE, field: 'children' }) };
    },
    coverImage(section, _, { linkBuilder }) {
      const id = get(section, '_edge.coverImage.node._id');
      const linkage = id ? { id, type: 'platform/asset/image' } : null;
      return { linkage, ...linkBuilder.linkage({ id: section._id, type: TYPE, field: 'coverImage' }) };
    },
    logo(section, _, { linkBuilder }) {
      const id = get(section, '_edge.logo.node._id');
      const linkage = id ? { id, type: 'platform/asset/image' } : null;
      return { linkage, ...linkBuilder.linkage({ id: section._id, type: TYPE, field: 'logo' }) };
    },
    options(section, _, { linkBuilder }) {
      return { linkage: [], ...linkBuilder.linkage({ id: section._id, type: TYPE, field: 'options' }) };
    },
    parent(section, _, { linkBuilder }) {
      const id = get(section, '_edge.parent.node._id');
      const linkage = id ? { id, type: 'website/section' } : null;
      return { linkage, ...linkBuilder.linkage({ id: section._id, type: TYPE, field: 'parent' }) };
    },
    relatedSections(section, _, { linkBuilder }) {
      const linkage = getAsArray(section, '_connection.related')
        .filter((edge) => edge && edge.node)
        .map((edge) => edge.node._id)
        .sort()
        .map((id) => ({ id, type: 'website/section' }));
      return { linkage, ...linkBuilder.linkage({ id: section._id, type: TYPE, field: 'relatedSections' }) };
    },
    relatedTaxonomy(section, _, { linkBuilder }) {
      return { linkage: [], ...linkBuilder.linkage({ id: section._id, type: TYPE, field: 'relatedTaxonomy' }) };
    },
    self(section, _, { linkBuilder }) {
      return linkBuilder.self({ id: section._id, type: 'website/section' });
    },
    site(section, _, { linkBuilder }) {
      const id = get(section, '_edge.website.node._id');
      const linkage = id ? { id, type: 'website/product/site' } : null;
      return { linkage, ...linkBuilder.linkage({ id: section._id, type: TYPE, field: 'site' }) };
    },
  },
};
