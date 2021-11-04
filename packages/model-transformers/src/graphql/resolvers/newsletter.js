import { cleanPath, isObject, trim } from '@cms-apis/utils';
import { getAsArray, getAsObject } from '@cms-apis/object-path';
import { primeLoader, sortBy } from '../utils/index.js';
import { buildObjValues, findMany } from './utils/index.js';

export default {
  /**
   *
   */
  Newsletter: {
    _connection(newsletter, _, { dbs, loaders }) {
      return {
        async sections() {
          const query = { 'deployment.$id': newsletter._id };
          const cursor = await dbs.legacy.repo('email.Section').find({ query });
          const docs = await cursor.toArray();
          primeLoader({ loader: loaders.get('email.Section'), docs });
          return sortBy(docs, 'name').map((node) => ({ node }));
        },
      };
    },
    _edge(newsletter, _, { loaders }) {
      return {
        async website() {
          const { siteId } = newsletter;
          if (!siteId) throw new Error(`Unable to load a site ID for newsletter ID ${newsletter._id}`);
          const node = await loaders.get('website.Site').load(siteId);
          return { node };
        },
      };
    },
    _sync() {
      return {};
    },
    defaults(newsletter) {
      return {
        fromName: trim(newsletter.defaultFromName),
        subjectLine: trim(newsletter.defaultFromName),
        testers: getAsArray(newsletter.defaultTesters),
      };
    },
    provider(newsletter) {
      const provider = getAsObject(newsletter, 'provider');
      const { attributes } = provider;
      return buildObjValues([
        ['type', trim(provider.type)],
        ['providerId', trim(provider.providerId)],
        ['attributes', isObject(attributes) && Object.keys(attributes).length ? attributes : null],
      ]);
    },
    sourceProvider(newsletter) {
      const sourceProvider = getAsObject(newsletter, 'sourceProvider');
      const path = cleanPath(sourceProvider.path);
      const { host } = sourceProvider;
      return buildObjValues([
        ['handlerKey', trim(sourceProvider.handlerKey)],
        ['host', host ? cleanPath(host.replace(/^http[s]?:\/\//i, '')) : null],
        ['path', path ? `/${path}` : null],
      ]);
    },
  },

  /**
   *
   */
  Query: {
    async newsletterById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('email.Newsletter').load(id);
    },

    async newsletters(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'email.Newsletter',
        after,
        limit,
        query,
      }, { dbs, loaders });
    },
  },
};
