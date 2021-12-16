import { cleanPath, trim } from '@cms-apis/utils';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  WebsiteRedirect: {
    _edge(redirect, _, { loaders }) {
      return {
        async website() {
          const { siteId } = redirect;
          if (!siteId) throw new Error(`Unable to load a site ID for redirect ID ${redirect._id}`);
          const node = await loaders.get('website.Site').load(siteId);
          return { node };
        },
      };
    },
    code({ code }) {
      return [301, 302].includes(code) ? code : 301;
    },
    from(redirect) {
      const from = cleanPath(redirect.from);
      return from ? `/${from}` : null;
    },
    to(redirect) {
      const to = trim(redirect.to);
      if (!to) return null;
      if (/^http/i.test(to)) return to;
      const cleaned = cleanPath(to);
      return cleaned ? `/${cleaned}` : null;
    },
  },

  /**
   *
   */
  Query: {
    async websiteRedirectById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('website.Redirects').load(id);
    },

    async websiteRedirects(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'website.Redirects',
        after,
        limit,
        query,
        prime: false,
      }, { dbs, loaders });
    },
  },
};
