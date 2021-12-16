import { asArray, trim } from '@cms-apis/utils';
import { buildObjValues, findMany } from './utils/index.js';

export default {
  /**
   *
   */
  User: {
    date({ lastLoggedIn }) {
      return buildObjValues([
        ['lastLoggedIn', lastLoggedIn],
      ]);
    },
    isEnabled({ enabled }) {
      return Boolean(enabled);
    },
    name(user) {
      const firstName = trim(user.firstName);
      const lastName = trim(user.lastName);
      const full = [firstName, lastName].filter((v) => v).join(' ') || null;
      return buildObjValues([
        ['first', firstName],
        ['last', lastName],
        ['full', full],
      ]);
    },
    mustChangePassword({ mustChange }) {
      return Boolean(mustChange);
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
