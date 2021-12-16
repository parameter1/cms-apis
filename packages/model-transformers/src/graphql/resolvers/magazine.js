import { LegacyDB } from '@cms-apis/db';
import { trim } from '@cms-apis/utils';
import { primeLoader, sortBy } from '../utils/index.js';
import { buildObjValues, findMany, resolveSocialLinks } from './utils/index.js';

export default {
  /**
   *
   */
  Magazine: {
    _connection(magazine, _, { dbs, loaders }) {
      return {
        async issues() {
          const query = { 'publication.$id': magazine._id };
          const cursor = await dbs.legacy.repo('magazine.Issue').find({ query });
          const docs = await cursor.toArray();
          const filtered = docs.filter((node) => node);
          primeLoader({ loader: loaders.get('magazine.Issue'), docs: filtered });
          return sortBy(filtered, '_id').map((node) => ({ node }));
        },
        async sections() {
          const query = { 'publication.$id': magazine._id };
          const cursor = await dbs.legacy.repo('magazine.Section').find({ query });
          const docs = await cursor.toArray();
          const filtered = docs.filter((node) => node);
          primeLoader({ loader: loaders.get('magazine.Section'), docs: filtered });
          return sortBy(filtered, '_id').map((node) => ({ node }));
        },
      };
    },
    _edge(magazine, _, { loaders }) {
      return {
        async image() {
          const imageId = LegacyDB.extractRefId(magazine.coverImage);
          if (!imageId) return null;
          const node = await loaders.get('platform.Image').load(imageId);
          if (!node) return null;
          return { node };
        },
      };
    },
    links(magazine) {
      return buildObjValues([
        ['social', resolveSocialLinks(magazine)],
        ['subscribe', trim(magazine.subscribeUrl)],
        ['renewal', trim(magazine.renewalUrl)],
        ['reprint', trim(magazine.reprintsUrl)],
        ['einquiry', trim(magazine.einquiryUrl)],
      ]);
    },
  },

  /**
   *
   */
  Query: {
    async magazineById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('magazine.Publication').load(id);
    },

    async magazines(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'magazine.Publication',
        after,
        limit,
        query,
      }, { dbs, loaders });
    },
  },
};
