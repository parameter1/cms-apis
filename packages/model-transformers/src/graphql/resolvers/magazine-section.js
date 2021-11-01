import { LegacyDB } from '@cms-apis/db';
import { trim } from '@cms-apis/utils';
import findMany from './utils/find-many.js';

const loadPubFor = async (section, { loaders }) => {
  const publicationId = LegacyDB.extractRefId(section.publication);
  if (!publicationId) throw new Error(`Unable to load a publication ID for section ID ${section._id}`);
  return loaders.get('magazine.Publication').load(publicationId);
};

export default {
  /**
   *
   */
  MagazineSection: {
    async fullName(section, _, { loaders }) {
      const pub = await loadPubFor(section, { loaders });
      return [pub.name, trim(section.name) || 'Default'].map(trim).filter((v) => v).join(' > ');
    },
    async magazine(section, _, { loaders }) {
      const node = await loadPubFor(section, { loaders });
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
    async magazineSectionById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('magazine.PublicationSection').load(id);
    },

    async magazineSections(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'magazine.PublicationSection',
        after,
        limit,
        query,
      }, { dbs, loaders });
    },
  },
};
