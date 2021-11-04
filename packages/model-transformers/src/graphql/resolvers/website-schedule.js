import { LegacyDB } from '@cms-apis/db';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  WebsiteSchedule: {
    _edge(schedule, _, { loaders }) {
      return {
        async content() {
          const contentId = LegacyDB.extractRefId(schedule.content);
          if (!contentId) throw new Error(`Unable to load a content ID for schedule ID ${schedule._id}`);
          const node = await loaders.get('platform.Content').load(contentId);
          return { node };
        },
        async option() {
          const optionId = LegacyDB.extractRefId(schedule.option);
          if (!optionId) throw new Error(`Unable to load a option ID for schedule ID ${schedule._id}`);
          const node = await loaders.get('website.Option').load(optionId);
          return { node };
        },
        async section() {
          const sectionId = LegacyDB.extractRefId(schedule.section);
          if (!sectionId) throw new Error(`Unable to load a section ID for schedule ID ${schedule._id}`);
          const node = await loaders.get('website.Section').load(sectionId);
          return { node };
        },
      };
    },
    _sync() {
      return {};
    },
    date({ startDate, endDate }) {
      return { started: startDate, ended: endDate };
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
      return findMany({
        resource: 'website.Schedule',
        after,
        limit,
        query,
        prime: false,
      }, { dbs, loaders });
    },
  },
};
