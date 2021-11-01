import { LegacyDB } from '@cms-apis/db';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  MagazineIssueSection: {
    async magazineIssue(section, _, { loaders }) {
      const issueId = LegacyDB.extractRefId(section.issue);
      if (!issueId) throw new Error(`Unable to load an issue ID for section ID ${section._id}`);
      const node = await loaders.get('magazine.Issue').load(issueId);
      return { node };
    },
    sequence({ sequence }) {
      return parseInt(sequence, 10) || 0;
    },
  },

  /**
   *
   */
  Query: {
    async magazineIssueSectionById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('magazine.IssueSection').load(id);
    },

    async magazineIssueSections(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'magazine.IssueSection',
        after,
        limit,
        query,
        requiredFields: ['name'],
      }, { dbs, loaders });
    },
  },
};
