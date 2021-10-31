import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  Newsletter: {
    async website(newsletter, _, { loaders }) {
      const { siteId } = newsletter;
      if (!siteId) throw new Error(`Unable to load a site ID for newsletter ID ${newsletter._id}`);
      const node = await loaders.get('website.Site').load(siteId);
      return { node };
    },
  },

  /**
   *
   */
  Query: {
    async newsletterById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('email.Newsletter').load(id);
    },

    async newsletters(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'email.Newsletter',
        after,
        limit,
        query,
      }, { dbs, loaders });
    },
  },
};