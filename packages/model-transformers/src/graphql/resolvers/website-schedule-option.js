import { LegacyDB } from '@cms-apis/db';
import { trim } from '@cms-apis/utils';
import { sluggify } from '@cms-apis/slug';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  WebsiteScheduleOption: {
    _edge(option, _, { loaders }) {
      return {
        async website() {
          const siteId = LegacyDB.extractRefId(option.site);
          if (!siteId) throw new Error(`Unable to load a site ID for option ID ${option._id}`);
          const node = await loaders.get('website.Site').load(siteId);
          return { node };
        },
      };
    },
    async name(option, _, { loaders }) {
      const name = trim(option.name);
      const siteId = LegacyDB.extractRefId(option.site);
      if (!siteId) throw new Error(`Unable to load a site ID for option ID ${option._id}`);
      const node = await loaders.get('website.Site').load(siteId);
      const full = [trim(node.name), trim(option.name)].filter((v) => v).join(' > ');
      return { default: name, full };
    },
    slug({ name }) {
      return sluggify(name);
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
      }, { dbs, loaders });
    },
  },
};
