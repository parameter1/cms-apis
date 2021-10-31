import { trim } from '@cms-apis/utils';
import { getAsArray } from '@cms-apis/object-path';
import { primeLoader, sortBy } from '../utils/index.js';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  Newsletter: {
    defaults(newsletter) {
      return {
        fromName: trim(newsletter.defaultFromName),
        subjectLine: trim(newsletter.defaultFromName),
        testers: getAsArray(newsletter.defaultTesters),
      };
    },
    async sections(newsletter, _, { dbs, loaders }) {
      const query = { 'deployment.$id': newsletter._id };
      const cursor = await dbs.legacy.repo('email.Section').find({ query });
      const docs = await cursor.toArray();
      primeLoader({ loader: loaders.get('email.Section'), docs });
      return sortBy(docs, 'name').map((node) => ({ node }));
    },
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
