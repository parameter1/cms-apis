import { LegacyDB } from '@cms-apis/db';
import { trim } from '@cms-apis/utils';
import findMany from './utils/find-many.js';

const loadIssueFor = async (section, { loaders, shouldError = false }) => {
  const issueId = LegacyDB.extractRefId(section.issue);
  if (!issueId) {
    if (shouldError) throw new Error(`Unable to load an issue ID for section ID ${section._id}`);
    return null;
  }
  return loaders.get('magazine.Issue').load(issueId);
};

const loadPubFor = async (section, { loaders }) => {
  const publicationId = LegacyDB.extractRefId(section.publication);
  if (publicationId) return loaders.get('magazine.Publication').load(publicationId);
  // attempt to load pub from issue
  const issue = await loadIssueFor(section, { loaders, shouldError: true });
  const issuePubId = LegacyDB.extractRefId(issue.publication);
  if (!issuePubId) throw new Error(`Unable to load an issue publication for section ID ${section._id}`);
  return loaders.get('magazine.Publication').load(issuePubId);
};

export default {
  /**
   *
   */
  MagazineSection: {
    _edge(section, _, { loaders }) {
      return {
        async issue() {
          const node = await loadIssueFor(section, { loaders });
          return node ? { node } : null;
        },
        async magazine() {
          const node = await loadPubFor(section, { loaders });
          return { node };
        },
      };
    },
    async isGlobal(section, _, { loaders }) {
      const issue = await loadIssueFor(section, { loaders });
      const hasIssue = Boolean(issue);
      return !hasIssue;
    },
    async name(section, _, { loaders }) {
      const name = trim(section.name) || 'Default';

      const [issue, pub] = await Promise.all([
        loadIssueFor(section, { loaders }),
        loadPubFor(section, { loaders }),
      ]);
      const hasIssue = Boolean(issue);
      const isGlobal = !hasIssue;

      const parts = [trim(pub.name)];
      if (hasIssue) parts.push(issue.name);
      parts.push(`${name}${isGlobal ? ' (Global)' : ''}`);

      return { default: name, full: parts.map(trim).filter((v) => v).join(' > ') || null };
    },
    sequence({ sequence }) {
      return parseInt(sequence, 10) || 0;
    },
  },

  /**
   *
   */
  Query: {
    async magazineSectionById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('magazine.Section').load(id);
    },

    async magazineSections(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'magazine.Section',
        after,
        limit,
        query,
      }, { dbs, loaders });
    },
  },
};
