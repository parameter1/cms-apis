import { LegacyDB } from '@cms-apis/db';
import { primeLoader, sortBy } from '../utils/index.js';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  Magazine: {
    async coverImage(magazine, _, { loaders }) {
      const imageId = LegacyDB.extractRefId(magazine.coverImage);
      if (!imageId) return null;
      const node = await loaders.get('platform.Image').load(imageId);
      if (!node) return null;
      return { node };
    },
    async issues(magazine, _, { dbs, loaders }) {
      const query = { 'publication.$id': magazine._id };
      const cursor = await dbs.legacy.repo('magazine.Issue').find({ query });
      const docs = await cursor.toArray();
      primeLoader({ loader: loaders.get('magazine.Issue'), docs });
      return sortBy(docs, '_id').map((node) => ({ node }));
    },
    async sections(magazine, _, { dbs, loaders }) {
      const query = { 'publication.$id': magazine._id };
      const cursor = await dbs.legacy.repo('magazine.PublicationSection').find({ query });
      const docs = await cursor.toArray();
      primeLoader({ loader: loaders.get('magazine.PublicationSection'), docs });
      return sortBy(docs, '_id').map((node) => ({ node }));
    },
    urls(magazine) {
      return {
        subscribe: magazine.subscribeUrl,
        renewal: magazine.renewalUrl,
        reprints: magazine.reprintsUrl,
        einquiry: magazine.einquiryUrl,
      };
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
