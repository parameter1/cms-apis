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

const mediaTypes = new Set(['Document', 'Infographic', 'Podcast', 'PressRelease', 'Video', 'Webinar', 'Whitepaper']);

const parentFieldMap = new Map([
  ['Company', 'parentCompany'],
  ['Supplier', 'parentSupplier'],
  ['Venue', 'parentVenue'],
]);

const socialProviders = new Map([
  ['FACEBOOK', 'Facebook'],
  ['INSTAGRAM', 'Instagram'],
  ['LINKEDIN', 'LinkedIn'],
  ['PINTEREST', 'Pinterest'],
  ['TIKTOK', 'TikTok'],
  ['TWITTER', 'Twitter'],
  ['YOUTUBE', 'YouTube'],
  ['OTHER', 'Other'],
]);

export default {
  /**
   *
   */
  Content: {
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
    connections(content) {
      return content;
    },
    contact(content) {
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
      const address = buildObjValues([
        ['street', trim(content.address1)],
        ['streetExtra', trim(content.address2)],
        ['city', city],
        ['region', region],
        ['postalCode', postalCode],
        ['country', trim(content.country)],
        ['location', geo],
        ['cityRegionPostalCode', cityRegionPostalCode],
      ]);

      return buildObjValues([
        ['address', address],
        ['emails', emails],
        ['phones', phones],
        ['person', person],
      ]);
    },
    dates(content) {
      return buildObjValues([
        ['expired', content.unpublished],
        ['published', content.published],
        ['created', content.created],
        ['updated', content.updated],
        ['touched', content.touched],
        ['start', content.startDate],
        ['end', content.endDate],
      ]);
    },
    edges(content) {
      return content;
    },
    inquiry(content) {
      // @todo determine how to generate emails. emails should only appear
      // on "owning" rels like Company or Supplier
      const isEnabled = get(content, 'mutations.Website.enableRmi');
      return {
        isEnabled: isEnabled == null || isEnabled === true,
      };
    },
    labels(content) {
      return getAsArray(content, 'labels').map(trim).filter((v) => v);
    },
    links(content) {
      const external = getAsArray(content, 'externalLinks').map((link) => {
        const url = cleanWebsite(link.url);
        if (!url) return null;
        return { key: trim(link.key), url, label: trim(link.label) };
      }).filter((v) => v);

      const urlFieldMap = new Map([
        ['productUrl', { key: 'product', label: 'Product URL' }],
        ['iTunesUrl', { key: 'itunes', label: 'iTunes' }],
        ['googlePlayUrl', { key: 'googleplay', label: 'Google Play' }],
        ['downloadUrl', { key: 'download', label: 'Download URL' }],
      ]);

      urlFieldMap.forEach(({ key, label }, field) => {
        const url = cleanWebsite(content[field]);
        if (!url) return;
        external.push({ key, url, label });
      });

      return {
        external,
        social: getAsArray(content, 'socialLinks').map((link) => {
          if (!link) return null;
          const url = cleanWebsite(link.url);
          if (!url) return null;

          let label = trim(link.label);
          let provider = trim(link.provider);
          if ((!provider || provider.toUpperCase() === 'OTHER') && label && socialProviders.has(label.toUpperCase())) {
            provider = label;
          }
          if (!provider) provider = 'Other';
          provider = provider.toUpperCase();
          if (!label && provider !== 'OTHER') label = socialProviders.get(provider);
          return { provider, url, label };
        }).filter((v) => v),
        website: cleanWebsite(content.website),
      };
    },
    media(content) {
      if (!mediaTypes.has(content.type)) return null;
      const file = buildObjValues([
        ['name', trim(content.fileName)],
        ['path', cleanPath(content.filePath)],
      ]);
      const source = buildObjValues([
        ['id', trim(`${content.sourceId || ''}`)],
        ['key', trim(content.source)],
      ]);
      return buildObjValues([
        ['file', file],
        ['source', source],
        ['duration', parseNumber(content.duration, { type: 'float' })],
        ['embedCode', trim(content.embedCode)],
        ['credit', trim(content.credit)],
      ]);
    },
    meta(content) {
      const statesServed = getAsArray(content.statesServed).map(trim).filter((v) => v);
      const company = content.type === 'Company' ? buildObjValues([
        ['type', trim(content.companyType)],
        ['statesServed', statesServed.length ? statesServed : null],
        ...[
          'numberOfEmployees',
          'trainingInformation',
          'yearsInOperation',
          'salesRegion',
          'servicesProvided',
          'salesChannels',
          'productSummary',
          'serviceInformation',
          'warrantyInformation',
        ].map((field) => [field, trim(content[field])]),
      ]) : null;
      const event = content.type === 'Event' ? buildObjValues([
        ['type', trim(content.eventType)],
        ['cost', trim(content.cost)],
        ['beneficiary', trim(content.beneficiary)],
        ['allDay', content.allDay == null ? null : content.allDay],
      ]) : null;
      const job = content.type === 'Job' ? buildObjValues([
        ['type', trim(content.jobType)],
        ...[
          'salary',
          'city',
          'state',
          'email',
          'information',
          'phone',
          'website',
          'sourceUrl',
        ].map((field) => [field, trim(content[field])]),
      ]) : null;
      const product = content.type === 'Product' ? buildObjValues([
        ['modelNumber', trim(content.modelNumber)],
        ['status', trim(content.contentStatus)],
      ]) : null;
      return buildObjValues([
        ['company', company],
        ['event', event],
        ['job', job],
        ['product', product],
      ]);
    },
    names(content) {
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
    syndication(content) {
      if (content.type !== 'News') return null;
      return buildObjValues([
        ['source', trim(content.source)],
        ['byline', trim(content.byline)],
      ]);
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
  },

  /**
   *
   */
  ContentConnections: {
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
          let type = typeMap.get(field) || 'Other';
          if (type === 'Other' && mediaTypes.has(content.type)) type = 'Media';
          arr.push({ type, node });
        });
        return arr;
      }, []);
    },
    async images(content, _, { loaders }) {
      const imageIds = LegacyDB.extractRefIds(content.images);
      if (!imageIds.length) return [];
      const docs = await loaders.get('platform.Image').loadMany(imageIds);
      return sortBy(docs, '_id').map((node) => ({ node }));
    },
    async relatedTo(content, _, { loaders }) {
      const relatedToIds = LegacyDB.extractRefIds(content.relatedTo);
      if (!relatedToIds.length) return [];
      const docs = await loaders.get('platform.Content').loadMany(relatedToIds);
      return sortBy(docs, '_id').map((node) => ({ node }));
    },
  },

  /**
   *
   */
  ContentEdges: {
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
    async parent(content, _, { loaders }) {
      const field = parentFieldMap.get(content.type);
      if (!field) return null;
      const parentId = LegacyDB.extractRefId(content[field]);
      if (!parentId) return null;
      const node = await loaders.get('platform.Content').load(parentId);
      if (!node || node.type !== content.type) return null;
      return { node };
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
  ContentTypeEnum: {
    ARTICLE: 'Article',
    BLOG: 'Blog',
    COMPANY: 'Company',
    CONTACT: 'Contact',
    DOCUMENT: 'Document',
    EVENT: 'Event',
    JOB: 'Job',
    MEDIA_GALLERY: 'MediaGallery',
    NEWS: 'News',
    PAGE: 'Page',
    PODCAST: 'Podcast',
    PRESS_RELEASE: 'PressRelease',
    PRODUCT: 'Product',
    PROMOTION: 'Promotion',
    SPACE: 'Space',
    SUPPLIER: 'Supplier',
    TEXT_AD: 'TextAd',
    VENUE: 'Venue',
    VIDEO: 'Video',
    WEBINAR: 'Webinar',
    WHITEPAPER: 'Whitepaper',
  },

  /**
   *
   */
  ContentContactTypeEnum: {
    AUTHOR: 'Author',
    CONTRIBUTOR: 'Contributor',
    PHOTOGRAPHER: 'Photographer',
    LISTING: 'Listing',
    PUBLIC: 'Public',
    SALES: 'Sales',
    MARKETING: 'Marketing',
    EDITOR: 'Editor',
    MEDIA: 'Media',
    OTHER: 'Other',
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
