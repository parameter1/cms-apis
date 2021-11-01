import { LegacyDB } from '@cms-apis/db';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  MagazineSchedule: {
    async content(schedule, _, { loaders }) {
      const contentId = LegacyDB.extractRefId(schedule.content);
      if (!contentId) throw new Error(`Unable to load a content ID for schedule ID ${schedule._id}`);
      const node = await loaders.get('platform.Content').load(contentId);
      return { node };
    },
    async section(schedule, _, { loaders }) {
      const sectionId = LegacyDB.extractRefId(schedule.section);
      if (!sectionId) throw new Error(`Unable to load a section ID for schedule ID ${schedule._id}`);
      const node = await loaders.get('magazine.Section').load(sectionId);
      return { node };
    },
  },

  /**
   *
   */
  Query: {
    async magazineScheduleById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('magazine.Schedule').load(id);
    },

    async magazineSchedules(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      const [sectionIds] = await Promise.all([
        dbs.legacy.repo('magazine.Section').distinct({ key: '_id' }),
      ]);
      return findMany({
        resource: 'magazine.Schedule',
        after,
        limit,
        query,
        prime: false,
        requiredQuery: { section: { $in: sectionIds } },
      }, { dbs, loaders });
    },
  },
};
