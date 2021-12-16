import { LegacyDB } from '@cms-apis/db';
import { trim } from '@cms-apis/utils';
import { buildObjValues, findMany } from './utils/index.js';

const loadPubFor = async (issue, { loaders }) => {
  const publicationId = LegacyDB.extractRefId(issue.publication);
  if (!publicationId) throw new Error(`Unable to load a publication ID for issue ID ${issue._id}`);
  return loaders.get('magazine.Publication').load(publicationId);
};

export default {
  /**
   *
   */
  MagazineIssue: {
    _edge(issue, _, { loaders }) {
      return {
        async coverImage() {
          const imageId = LegacyDB.extractRefId(issue.coverImage);
          if (!imageId) return null;
          const node = await loaders.get('platform.Image').load(imageId);
          if (!node) return null;
          return { node };
        },
        async magazine() {
          const node = await loadPubFor(issue, { loaders });
          return { node };
        },
      };
    },
    date({ mailDate }) {
      return { mailed: mailDate };
    },
    async name(issue, _, { loaders }) {
      const name = trim(issue.name);
      const pub = await loadPubFor(issue, { loaders });
      return { default: name, full: [trim(pub.name), name].filter((v) => v).join(' > ') || null };
    },
    url(issue) {
      return buildObjValues([
        ['digitalEdition', trim(issue.digitalEditionUrl)],
      ]);
    },
  },

  /**
   *
   */
  Query: {
    async magazineIssueById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('magazine.Issue').load(id);
    },

    async magazineIssues(_, { input }, { dbs, loaders }) {
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
