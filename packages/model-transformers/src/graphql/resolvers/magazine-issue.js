import { LegacyDB } from '@cms-apis/db';
import { asArray, cleanPath } from '@cms-apis/utils';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  MagazineIssue: {
    dates({ mailDate }) {
      return { mailed: mailDate };
    },
    async coverImage(issue, _, { loaders }) {
      const imageId = LegacyDB.extractRefId(issue.coverImage);
      if (!imageId) return null;
      const node = await loaders.get('platform.Image').load(imageId);
      if (!node) return null;
      return { node };
    },
    async magazine(issue, _, { loaders }) {
      const publicationId = LegacyDB.extractRefId(issue.publication);
      if (!publicationId) throw new Error(`Unable to load a publication ID for issue ID ${issue._id}`);
      const node = await loaders.get('magazine.Publication').load(publicationId);
      return { node };
    },
    redirects({ redirects }) {
      return asArray(redirects).map(cleanPath).filter((v) => v);
    },
    urls(issue) {
      return { digitalEdition: issue.digitalEditionUrl };
    },
  },

  /**
   *
   */
  Query: {
    async  magazineIssueById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('magazine.Issue').load(id);
    },

    async  magazineIssues(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'magazine.Issue',
        after,
        limit,
        query,
      }, { dbs, loaders });
    },
  },
};
