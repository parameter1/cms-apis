import { LegacyDB } from '@cms-apis/db';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  NewsletterSchedule: {
    _edge(schedule, _, { loaders }) {
      return {
        async content() {
          const contentId = LegacyDB.extractRefId(schedule.content);
          if (!contentId) throw new Error(`Unable to load a content ID for schedule ID ${schedule._id}`);
          const node = await loaders.get('platform.Content').load(contentId);
          return { node };
        },
        async section() {
          const sectionId = LegacyDB.extractRefId(schedule.section);
          if (!sectionId) throw new Error(`Unable to load a section ID for schedule ID ${schedule._id}`);
          const node = await loaders.get('email.Section').load(sectionId);
          return { node };
        },
      };
    },
    _sync() {
      return {};
    },
    date({ deploymentDate }) {
      return { deployed: deploymentDate };
    },
    sequence({ sequence }) {
      return parseInt(sequence, 10) || 0;
    },
  },

  /**
   *
   */
  Query: {
    async newsletterScheduleById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('email.Schedule').load(id);
    },

    async newsletterSchedules(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'email.Schedule',
        after,
        limit,
        query,
        prime: false,
      }, { dbs, loaders });
    },
  },
};
