import { asObject, trim } from '@cms-apis/utils';
import { primeLoader, sortBy } from '../utils/index.js';
import { CDN_ASSET_HOSTNAME, CDN_IMAGE_HOSTNAME } from '../../env.js';
import findMany from './utils/find-many.js';

const defaults = {
  date: {
    timezone: 'America/Chicago',
    format: 'MMM Do, YYYY',
    locale: 'en',
  },
  language: {
    primaryCode: 'en',
    subCode: 'us',
  },
};

export default {
  /**
   *
   */
  WebsiteSite: {
    date({ date }) {
      return { ...defaults.date, ...asObject(date) };
    },
    hosts(content) {
      const image = trim(content.imageHost);
      const asset = trim(content.assetHost);
      return {
        root: trim(content.host),
        image: image || CDN_IMAGE_HOSTNAME,
        asset: asset || CDN_ASSET_HOSTNAME,
      };
    },
    language({ language }) {
      return { ...defaults.language, ...asObject(language) };
    },
    origin(site) {
      const host = trim(site.host);
      return host ? `https://${host}` : null;
    },
    async options(site, _, { dbs, loaders }) {
      const query = { 'site.$id': site._id };
      const cursor = await dbs.legacy.repo('website.Option').find({ query });
      const docs = await cursor.toArray();
      primeLoader({ loader: loaders.get('website.Option'), docs });
      return sortBy(docs, '_id').map((node) => ({ node }));
    },
    async sections(site, _, { dbs, loaders }) {
      const query = { 'site.$id': site._id };
      const cursor = await dbs.legacy.repo('website.Section').find({ query });
      const docs = await cursor.toArray();
      primeLoader({ loader: loaders.get('website.Section'), docs });
      return sortBy(docs, 'fullName').map((node) => ({ node }));
    },
    title(site) {
      const name = trim(site.name);
      const shortName = trim(site.shortName);
      if (!shortName) return name;
      return name ? `${name} (${shortName})` : null;
    },
  },

  /**
   *
   */
  /**
   *
   */
  WebsiteSiteLanguage: {
    code(language) {
      const { primaryCode, subCode } = language;
      const primary = primaryCode.toLowerCase();
      if (!subCode) return primary;
      return `${primary}-${subCode.toLowerCase()}`;
    },
    primaryCode(language) {
      return language.primaryCode.toLowerCase();
    },
    subCode(language) {
      if (!language.subCode) return null;
      return language.subCode.toLowerCase();
    },
  },

  /**
   *
   */
  Query: {
    async websiteSiteById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('website.Site').load(id);
    },

    async websiteSites(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'website.Site',
        after,
        limit,
        query,
      }, { dbs, loaders });
    },
  },
};