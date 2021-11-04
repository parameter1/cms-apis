import { trim } from '@cms-apis/utils';
import { LegacyDB } from '@cms-apis/db';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  NewsletterSection: {
    _edge(section, _, { loaders }) {
      return {
        async newsletter() {
          const newsletterId = LegacyDB.extractRefId(section.deployment);
          if (!newsletterId) throw new Error(`Unable to load a newsletter ID for section ID ${section._id}`);
          const node = await loaders.get('email.Newsletter').load(newsletterId);
          return { node };
        },
      };
    },
    _sync() {
      return {};
    },
    name({ name, fullName }) {
      return { default: trim(name), full: trim(fullName) };
    },
    sequence({ sequence }) {
      return parseInt(sequence, 10) || 0;
    },
  },

  /**
   *
   */
  Query: {
    async newsletterSectionById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('email.Section').load(id);
    },

    async newsletterSections(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'email.Section',
        after,
        limit,
        query,
      }, { dbs, loaders });
    },
  },
};
