import { get, getAsArray, getAsObject } from '@cms-apis/object-path';
import { trim, cleanPath } from '@cms-apis/utils';
import { LegacyDB } from '@cms-apis/db';
import { sortBy } from '../utils/index.js';
import findMany from './utils/find-many.js';

const resolveType = async ({ type }) => `Content${type}`;

const getMutatedValue = ({ content, mutation, field }) => {
  const value = get(content, `mutations.${mutation}.${field}`);
  return trim(value);
};

export default {
  /**
   *
   */
  ContentInterface: {
    __resolveType: resolveType,
    body(content) {
      return {
        default: trim(content.body),
        newsletter: getMutatedValue({ content, mutation: 'Email', field: 'body' }),
        magazine: getMutatedValue({ content, mutation: 'Magazine', field: 'body' }),
        website: getMutatedValue({ content, mutation: 'Website', field: 'body' }),
      };
    },
    async company(content, _, { loaders }) {
      const companyId = LegacyDB.extractRefId(content.company);
      if (!companyId) return null;
      const node = await loaders.get('platform.Content').load(companyId);
      if (!node || node.type !== 'Company') return null;
      return { node };
    },
    async createdBy(content, _, { loaders }) {
      const userId = LegacyDB.extractRefId(content.createdBy);
      if (!userId) return null;
      const node = await loaders.get('platform.User').load(userId);
      return node ? { node } : null;
    },
    dates(content) {
      return {
        expired: content.unpublished,
        published: content.published,
        created: content.created,
        updated: content.updated,
        touched: content.touched,
      };
    },
    async images(content, _, { loaders }) {
      const imageIds = LegacyDB.extractRefIds(content.images);
      if (!imageIds.length) return [];
      const docs = await loaders.get('platform.Image').loadMany(imageIds);
      return sortBy(docs, '_id').map((node) => ({ node }));
    },
    name(content) {
      return {
        default: trim(content.name, ''),
        newsletter: getMutatedValue({ content, mutation: 'Email', field: 'name' }),
        magazine: getMutatedValue({ content, mutation: 'Magazine', field: 'name' }),
        website: getMutatedValue({ content, mutation: 'Website', field: 'name' }),
      };
    },
    async primaryImage(content, _, { loaders }) {
      const imageId = LegacyDB.extractRefId(content.primaryImage);
      if (!imageId) return null;
      const node = await loaders.get('platform.Image').load(imageId);
      if (!node) return null;
      return { node };
    },
    async primaryWebsiteSection(content, _, { defaults, loaders }) {
      const id = LegacyDB.extractRefIdFromPath(content, 'mutations.Website.primarySection');
      if (!id) return { node: defaults.websiteSection };
      const node = await loaders.get('website.Section').load(id);
      return { node };
    },
    async relatedTo(content, _, { loaders }) {
      const relatedToIds = LegacyDB.extractRefIds(content.relatedTo);
      if (!relatedToIds.length) return [];
      const docs = await loaders.get('platform.Content').loadMany(relatedToIds);
      return sortBy(docs, '_id').map((node) => ({ node }));
    },
    redirects(content) {
      return getAsArray(content, 'mutations.Website.redirects').map(cleanPath).filter((v) => v);
    },
    teaser(content) {
      return {
        default: trim(content.teaser),
        newsletter: getMutatedValue({ content, mutation: 'Email', field: 'teaser' }),
        magazine: getMutatedValue({ content, mutation: 'Magazine', field: 'teaser' }),
        website: getMutatedValue({ content, mutation: 'Website', field: 'teaser' }),
      };
    },
    async updatedBy(content, _, { loaders }) {
      const userId = LegacyDB.extractRefId(content.createdBy);
      if (!userId) return null;
      const node = await loaders.get('platform.User').load(userId);
      return node ? { node } : null;
    },
  },

  /**
   *
   */
  ContentAddressableInterface: {
    __resolveType: resolveType,
    cityRegionPostalCode(content) {
      const city = trim(content.city);
      const state = trim(content.state);
      const zip = trim(content.zip);

      let out = '';
      if (city && state) {
        out = `${city}, ${state}`;
      } else if (city) {
        out = `${city}`;
      } else if (state) {
        out = `${state}`;
      }
      if (zip) out = `${out} ${zip}`;
      return out || null;
    },
    location(content) {
      return getAsObject(content, 'location');
    },
  },

  /**
   *
   */
  Query: {
    /**
     *
     */
    contentInterfaceById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('platform.Content').load(id);
    },

    async contentInterfaces(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'platform.Content',
        after,
        limit,
        query,
        prime: false,
      }, { dbs, loaders });
    },
  },
};
