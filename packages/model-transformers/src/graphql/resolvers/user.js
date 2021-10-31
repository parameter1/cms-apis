import { asArray, trim } from '@cms-apis/utils';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  User: {
    enabled({ enabled }) {
      return Boolean(enabled);
    },
    mustChangePassword({ mustChange }) {
      return Boolean(mustChange);
    },
    name({ firstName, lastName }) {
      return [trim(firstName), trim(lastName)].filter((v) => v).join(' ') || null;
    },
    roles({ roles }) {
      return asArray(roles).map(trim).filter((v) => v);
    },
  },

  /**
   *
   */
  Query: {
    async userById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('platform.User').load(id);
    },

    async users(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'platform.User',
        after,
        limit,
        query,
      }, { dbs, loaders });
    },
  },
};
