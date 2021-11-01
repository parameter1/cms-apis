import { LegacyDB } from '@cms-apis/db';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  WebsiteSchedule: {
    async content(schedule, _, { loaders }) {
      const contentId = LegacyDB.extractRefId(schedule.content);
      if (!contentId) throw new Error(`Unable to load a content ID for schedule ID ${schedule._id}`);
      const node = await loaders.get('platform.Content').load(contentId);
      return { node };
    },
    dates({ startDate, endDate }) {
      return { start: startDate, end: endDate };
    },
    async section(schedule, _, { loaders }) {
      const sectionId = LegacyDB.extractRefId(schedule.section);
      if (!sectionId) throw new Error(`Unable to load a section ID for schedule ID ${schedule._id}`);
      const node = await loaders.get('website.Section').load(sectionId);
      return { node };
    },
    async option(schedule, _, { loaders }) {
      const optionId = LegacyDB.extractRefId(schedule.option);
      if (!optionId) throw new Error(`Unable to load a option ID for schedule ID ${schedule._id}`);
      const node = await loaders.get('website.Option').load(optionId);
      return { node };
    },
  },

  /**
   *
   */
  Query: {
    async websiteScheduleById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('website.Schedule').load(id);
    },

    async websiteSchedules(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      // const [sectionIds, contentIds] = await Promise.all([
      //   dbs.legacy.repo('email.Section').distinct({ key: '_id' }),
      //   dbs.legacy.repo('platform.Content').distinct({ key: '_id' }),
      // ]);
      return findMany({
        resource: 'website.Schedule',
        after,
        limit,
        query,
        prime: false,
        // requiredQuery: { section: { $in: sectionIds }, 'content.$id': { $in: contentIds } },
      }, { dbs, loaders });
    },
  },
};
