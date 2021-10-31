import { LegacyDB } from '@cms-apis/db';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  WebsiteScheduleOption: {
    async website(option, _, { loaders }) {
      const siteId = LegacyDB.extractRefId(option.site);
      if (!siteId) throw new Error(`Unable to load a site ID for option ID ${option._id}`);
      const node = await loaders.get('website.Site').load(siteId);
      return { node };
    },
  },

  /**
   *
   */
  Query: {
    async websiteScheduleOptionById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('website.Option').load(id);
    },

    async websiteScheduleOptions(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'website.Option',
        after,
        limit,
        query,
        requiredFields: ['name', 'site.$id'],
      }, { dbs, loaders });
    },
  },
};