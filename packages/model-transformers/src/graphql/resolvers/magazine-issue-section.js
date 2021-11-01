import { LegacyDB } from '@cms-apis/db';
import { trim } from '@cms-apis/utils';
import findMany from './utils/find-many.js';

const loadIssueFor = async (section, { loaders }) => {
  const issueId = LegacyDB.extractRefId(section.issue);
  if (!issueId) throw new Error(`Unable to load an issue ID for section ID ${section._id}`);
  return loaders.get('magazine.Issue').load(issueId);
};

const loadPubFor = async (issue, { loaders }) => {
  const publicationId = LegacyDB.extractRefId(issue.publication);
  if (!publicationId) throw new Error(`Unable to load a publication ID for issue ID ${issue._id}`);
  return loaders.get('magazine.Publication').load(publicationId);
};

export default {
  /**
   *
   */
  MagazineIssueSection: {
    async fullName(section, _, { loaders }) {
      const issue = await loadIssueFor(section, { loaders });
      const pub = await loadPubFor(issue, { loaders });
      return [pub.name, issue.name, trim(section.name) || 'Default'].map(trim).filter((v) => v).join(' > ');
    },
    async issue(section, _, { loaders }) {
      const node = await loadIssueFor(section, { loaders });
      return { node };
    },
    name({ name }) {
      return trim(name) || 'Default';
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
      }, { dbs, loaders });
    },
  },
};
