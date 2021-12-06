import { cleanPath } from '@cms-apis/utils';

export default {
  /**
   *
   */
  Taxonomy: {
    hierarchyIndex({ depth }) {
      return depth == null ? null : depth - 1;
    },
    urlPathWebsite(taxonomy) {
      const path = cleanPath(taxonomy.path);
      return `/${path}`;
    },
  },
};
