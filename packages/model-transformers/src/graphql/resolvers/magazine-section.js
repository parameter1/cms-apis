import { LegacyDB } from '@cms-apis/db';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  MagazineSection: {
    async magazine(section, _, { loaders }) {
      const publicationId = LegacyDB.extractRefId(section.publication);
      if (!publicationId) throw new Error(`Unable to load a publication ID for section ID ${section._id}`);
      const node = await loaders.get('magazine.Publication').load(publicationId);
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
        requiredFields: ['name'],
      }, { dbs, loaders });
    },
  },
};
