import { trim } from '@cms-apis/utils';
import { LegacyDB } from '@cms-apis/db';
import { formatStatus, primeLoader } from '../utils/index.js';

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

    async websiteSectionOptions(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;

      const required = { name: { $exists: true }, 'site.$id': { $exists: true } };

      const $and = [];
      const countAnd = [];
      if (required) {
        $and.push(required);
        countAnd.push(required);
      }
      if (query) {
        $and.push(query);
        countAnd.push(query);
      }
      if (after) $and.push({ _id: { $gt: after } });

      const repo = dbs.legacy.repo('website.Option');
      const cursor = await repo.find({
        query: { ...($and.length && { $and }) },
        options: { sort: { _id: 1 }, limit: limit + 1 },
      });
      const docs = await cursor.toArray();
      primeLoader({ loader: loaders.get('website.Option'), docs });

      const hasNextPage = docs.length > limit;
      const lastDoc = hasNextPage ? docs.pop() : null;

      return {
        edges: () => docs.map((node) => ({
          node,
          cursor: node._id,
        })),
        pageInfo: {
          totalCount: () => repo.countDocuments({
            query: { ...(countAnd.length && { $and: countAnd }) },
          }),
          hasNextPage,
          endCursor: lastDoc ? lastDoc._id : null,
        },
      };
    },
  },
};
