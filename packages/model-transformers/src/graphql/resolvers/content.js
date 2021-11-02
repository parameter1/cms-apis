import { get, getAsArray } from '@cms-apis/object-path';
import { trim, cleanPath, parseNumber } from '@cms-apis/utils';
import { LegacyDB } from '@cms-apis/db';
import { cleanWebsite } from '@cms-apis/clean-string';
import { sortBy } from '../utils/index.js';
import { buildObjValues, findMany } from './utils/index.js';

const getMutatedValue = ({ content, mutation, field }) => {
  const value = get(content, `mutations.${mutation}.${field}`);
  return trim(value);
};

export default {
  /**
   *
   */
  Content: {
    address(content) {
      const city = trim(content.city);
      const region = trim(content.state);
      const postalCode = trim(content.zip);
      const cityRegionPostalCode = (() => {
        let out = '';
        if (city && region) {
          out = `${city}, ${region}`;
        } else if (city) {
          out = `${city}`;
        } else if (region) {
          out = `${region}`;
        }
        if (postalCode) out = `${out} ${postalCode}`;
        return out || null;
      })();
      const location = buildObjValues([
        ['latitude', parseNumber(get(content, 'location.latitude'), { type: 'float' })],
        ['longitude', parseNumber(get(content, 'location.longitude'), { type: 'float' })],
      ]);
      let geo;
      if (location && location.longitude && location.latitude) {
        geo = { type: 'Point', coordinates: [location.longitude, location.latitude] };
      }
      return buildObjValues([
        ['street', trim(content.address1)],
        ['streetExtra', trim(content.address2)],
        ['city', city],
        ['region', region],
        ['postalCode', postalCode],
        ['country', trim(content.country)],
        ['location', geo],
        ['cityRegionPostalCode', cityRegionPostalCode],
      ]);
    },
    alias(content) {
      const alias = getMutatedValue({ content, mutation: 'Website', field: 'alias' });
      if (!alias || /^http[s]?:/i.test(alias) || /^www\./i.test(alias)) return null;
      return cleanPath(alias);
    },
    bodies(content) {
      return buildObjValues([
        ['default', trim(content.body)],
        ['newsletter', getMutatedValue({ content, mutation: 'Email', field: 'body' })],
        ['magazine', getMutatedValue({ content, mutation: 'Magazine', field: 'body' })],
        ['website', getMutatedValue({ content, mutation: 'Website', field: 'body' })],
        ['original', trim(content.bodyOriginal)],
      ]);
    },
    async company(content, _, { loaders }) {
      const companyId = LegacyDB.extractRefId(content.company);
      if (!companyId) return null;
      const node = await loaders.get('platform.Content').load(companyId);
      if (!node || node.type !== 'Company') return null;
      return { node };
    },
    contactInfo(content) {
      const emails = buildObjValues([
        ['default', trim(content.email)],
        ['public', trim(content.publicEmail)],
      ]);
      const phones = buildObjValues([
        ['default', trim(content.phone)],
        ['tollfree', trim(content.tollfree)],
        ['fax', trim(content.fax)],
        ['mobile', trim(content.mobile)],
      ]);
      const firstName = trim(content.firstName);
      const lastName = trim(content.lastName);
      const name = [firstName, lastName].filter((v) => v).join(' ') || null;
      const person = buildObjValues([
        ['name', name],
        ['firstName', firstName],
        ['lastName', lastName],
        ['title', trim(content.title)],
      ]);
      return buildObjValues([
        ['emails', emails],
        ['phones', phones],
        ['person', person],
        ['website', cleanWebsite(content.website)],
      ]);
    },
    async contacts(content, _, { loaders }) {
      const typeMap = new Map([
        ['authors', 'Author'],
        ['contributors', 'Contributor'],
        ['photographers', 'Photographer'],
        ['listingContacts', 'Listing'],
        ['publicContacts', 'Public'],
        ['salesContacts', 'Sales'],
        ['marketingContacts', 'Marketing'],
        ['contacts', 'Other'],
        ['editors', 'Editor'],
      ]);
      const idMap = [...typeMap.keys()].reduce((map, field) => {
        const ids = LegacyDB.extractRefIds(getAsArray(content, field));
        if (!ids.length) return map;
        ids.forEach((id) => {
          if (!map.has(id)) map.set(id, new Set());
          map.get(id).add(field);
        });
        return map;
      }, new Map());

      const ids = [...idMap.keys()];
      if (!ids.length) return [];
      const contacts = await loaders.get('platform.Content').loadMany(ids);

      return contacts.filter((c) => c && c.type === 'Contact').reduce((arr, node) => {
        idMap.get(node._id).forEach((field) => {
          const type = typeMap.get(field) || 'Other';
          arr.push({ type, node });
        });
        return arr;
      }, []);
    },
    async createdBy(content, _, { loaders }) {
      const userId = LegacyDB.extractRefId(content.createdBy);
      if (!userId) return null;
      const node = await loaders.get('platform.User').load(userId);
      return node ? { node } : null;
    },
    dates(content) {
      return buildObjValues([
        ['expired', content.unpublished],
        ['published', content.published],
        ['created', content.created],
        ['updated', content.updated],
        ['touched', content.touched],
      ]);
    },
    async images(content, _, { loaders }) {
      const imageIds = LegacyDB.extractRefIds(content.images);
      if (!imageIds.length) return [];
      const docs = await loaders.get('platform.Image').loadMany(imageIds);
      return sortBy(docs, '_id').map((node) => ({ node }));
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
    seo(content) {
      const title = getMutatedValue({ content, mutation: 'Website', field: 'seoTitle' })
        || getMutatedValue({ content, mutation: 'Website', field: 'name' })
        || trim(content.name);
      const description = getMutatedValue({ content, mutation: 'Website', field: 'seoDescription' })
        || getMutatedValue({ content, mutation: 'Website', field: 'teaser' })
        || trim(content.teaser);
      return buildObjValues([
        ['title', title],
        ['description', description],
      ]);
    },
    sidebars(content) {
      return getAsArray(content, 'sidebars');
    },
    teasers(content) {
      return buildObjValues([
        ['default', trim(content.teaser)],
        ['deck', getMutatedValue({ content, mutation: 'Magazine', field: 'deck' })],
        ['newsletter', getMutatedValue({ content, mutation: 'Email', field: 'teaser' })],
        ['magazine', getMutatedValue({ content, mutation: 'Magazine', field: 'teaser' })],
        ['website', getMutatedValue({ content, mutation: 'Website', field: 'teaser' })],
      ]);
    },
    titles(content) {
      return buildObjValues([
        ['default', trim(content.name)],
        ['short', trim(content.shortName)],
        ['full', trim(content.fullName)],
        ['headline', getMutatedValue({ content, mutation: 'Magazine', field: 'headline' })],
        ['newsletter', getMutatedValue({ content, mutation: 'Email', field: 'name' })],
        ['magazine', getMutatedValue({ content, mutation: 'Magazine', field: 'name' })],
        ['website', getMutatedValue({ content, mutation: 'Website', field: 'name' })],
      ]);
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
  ContentSidebar: {
    sequence({ sequence }) {
      return parseInt(sequence, 10) || 0;
    },
  },

  /**
   *
   */
  Query: {
    /**
     *
     */
    contentById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('platform.Content').load(id);
    },

    async allContent(_, { input }, { dbs, loaders }) {
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
