import { trim } from '@cms-apis/utils';
import { LegacyDB } from '@cms-apis/db';
import { formatStatus } from '../utils/index.js';

export default {
  /**
   *
   */
  WebsiteSectionOption: {
    description({ description }) {
      return trim(description);
    },
    name({ name }) {
      return trim(name);
    },
    status({ status }) {
      return formatStatus(status);
    },
    async websiteEdge(option, _, { loaders }) {
      const siteId = LegacyDB.extractRefId(option.site);
      if (!siteId) throw new Error(`Unable to load a website ID for option ID ${option._id}`);
      const node = await loaders.get('platform.Product').load(siteId);
      return { node };
    },
  },

  /**
   *
   */
  Query: {
    async websiteSectionOptionById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('website.Option').load(id);
    },
  },
};
