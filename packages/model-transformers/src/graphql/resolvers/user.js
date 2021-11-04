import { asArray, trim } from '@cms-apis/utils';
import { buildObjValues, findMany } from './utils/index.js';

export default {
  /**
   *
   */
  User: {
    _sync() {
      return {};
    },
    date({ lastLoggedIn }) {
      return buildObjValues([
        ['lastLoggedIn', lastLoggedIn],
      ]);
    },
    isEnabled({ enabled }) {
      return Boolean(enabled);
    },
    name({ firstName, lastName }) {
      return [trim(firstName), trim(lastName)].filter((v) => v).join(' ') || null;
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
