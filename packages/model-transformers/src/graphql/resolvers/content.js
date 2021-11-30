import { get, getAsArray, getAsObject } from '@cms-apis/object-path';
import {
  isObject,
  trim,
  cleanPath,
  parseNumber,
} from '@cms-apis/utils';
import { LegacyDB, types } from '@cms-apis/db';
import cleanString, { cleanWebsite, encodeHtmlEntities } from '@cms-apis/clean-string';
import { sortBy } from '../utils/index.js';
import {
  buildObjValues,
  findMany,
  getEmbedUrlFrom,
  truncateWords,
} from './utils/index.js';

const getMutatedValue = ({ content, mutation, field }) => {
  const value = get(content, `mutations.${mutation}.${field}`);
  return trim(value);
};

const cleanUrlOrPath = (value) => {
  const cleaned = cleanPath(value);
  if (!cleaned) return null;
  return /^http[s]?:/i.test(cleaned) ? cleaned : `/${cleaned}`;
};

const contentTypeMap = types.get('content').toArray().reduce((map, [enumKey, type]) => {
  map.set(type, enumKey);
  return map;
}, new Map());

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
    _connection(content, _, { loaders }) {
      return {
        async contacts() {
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
        async images() {
          const imageIds = LegacyDB.extractRefIds(content.images);
          if (!imageIds.length) return [];
          const docs = await loaders.get('platform.Image').loadMany(imageIds);
          return sortBy(docs, '_id').filter((node) => node).map((node) => ({ node }));
        },
        async relatedTo() {
          const relatedToIds = LegacyDB.extractRefIds(content.relatedTo);
          if (!relatedToIds.length) return [];
          const docs = await loaders.get('platform.Content').loadMany(relatedToIds);
          return sortBy(docs, '_id').filter((c) => c).map((node) => ({ node }));
        },
        async sponsors() {
          const companyIds = LegacyDB.extractRefIds(content.sponsors);
          if (!companyIds.length) return [];
          const docs = await loaders.get('platform.Content').loadMany(companyIds);
          return sortBy(docs, '_id').filter((c) => c && c.type === 'Company').map((node) => ({ node }));
        },
        async taxonomies() {
          const taxonomyIds = LegacyDB.extractRefIds(content.taxonomy);
          if (!taxonomyIds.length) return [];
          const nodes = await loaders.get('platform.Taxonomy').loadMany(taxonomyIds);
          return sortBy(nodes, '_id').filter((node) => node).map((node) => ({ node }));
        },
        websiteSchedules() {
          return getAsArray(content.sectionQuery).map((obj) => ({
            node: {
              section: { oid: obj.sectionId },
              option: { oid: obj.optionId },
              startDate: obj.start,
              endDate: obj.end,
            },
          }));
        },
      };
    },
    _edge(content, _, { defaults, loaders }) {
      return {
        async company() {
          const companyId = LegacyDB.extractRefId(content.company);
          if (!companyId) return null;
          const node = await loaders.get('platform.Content').load(companyId);
          if (!node || node.type !== 'Company') return null;
          return { node };
        },
        async createdBy() {
          const userId = LegacyDB.extractRefId(content.createdBy);
          if (!userId) return null;
          const node = await loaders.get('platform.User').load(userId);
          return node ? { node } : null;
        },
        async parent() {
          const field = parentFieldMap.get(content.type);
          if (!field) return null;
          const parentId = LegacyDB.extractRefId(content[field]);
          if (!parentId) return null;
          const node = await loaders.get('platform.Content').load(parentId);
          if (!node || node.type !== content.type) return null;
          return { node };
        },
        async primaryCategory() {
          const taxonomyId = LegacyDB.extractRefIdFromPath(content, 'mutations.Website.primaryCategory');
          if (!taxonomyId) return null;
          const node = await loaders.get('platform.Taxonomy').load(taxonomyId);
          if (!node) return null;
          return { node };
        },
        async primaryImage() {
          const imageId = LegacyDB.extractRefId(content.primaryImage);
          if (!imageId) return null;
          const node = await loaders.get('platform.Image').load(imageId);
          if (!node) return null;
          return { node };
        },
        async primaryWebsiteSection() {
          const id = LegacyDB.extractRefIdFromPath(content, 'mutations.Website.primarySection');
          if (!id) return { node: defaults.websiteSection };
          const node = await loaders.get('website.Section').load(id);
          return { node: node || defaults.websiteSection };
        },
        async updatedBy() {
          const userId = LegacyDB.extractRefId(content.createdBy);
          if (!userId) return null;
          const node = await loaders.get('platform.User').load(userId);
          return node ? { node } : null;
        },
      };
    },
    _sync() {
      return {};
    },
    alias(content) {
      const alias = getMutatedValue({ content, mutation: 'Website', field: 'alias' });
      if (!alias || /^http[s]?:/i.test(alias) || /^www\./i.test(alias)) return null;
      return cleanPath(alias);
    },
    body(content) {
      return buildObjValues([
        ['default', trim(content.body)],
        ['newsletter', getMutatedValue({ content, mutation: 'Email', field: 'body' })],
        ['magazine', getMutatedValue({ content, mutation: 'Magazine', field: 'body' })],
        ['website', getMutatedValue({ content, mutation: 'Website', field: 'body' })],
        ['original', trim(content.bodyOriginal)],
      ]);
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
    custom({ customAttributes }) {
      if (!isObject(customAttributes)) return null;
      if (!Object.keys(customAttributes).length) return null;
      return customAttributes;
    },
    date(content) {
      return buildObjValues([
        ['expired', content.unpublished],
        ['published', content.published],
        ['created', content.created],
        ['updated', content.updated],
        ['touched', content.touched],
        ['started', content.startDate],
        ['ended', content.endDate],
      ]);
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

      // handles `linkUrl` on webinars
      const linkUrl = cleanUrlOrPath(content.linkUrl);
      if (content.type === 'Webinar' && linkUrl) {
        external.push({ key: 'webinar', url: linkUrl, label: 'Webinar URL' });
      }

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
        redirect: (() => {
          const label = trim(content.linkText);
          const redirectTo = cleanUrlOrPath(get(content, 'mutations.Website.redirectTo'));
          if (redirectTo) return { url: redirectTo, label };
          return linkUrl && ['Promotion', 'TextAd'].includes(content.type) ? { url: linkUrl, label } : null;
        })(),
      };
    },
    media(content) {
      if (!mediaTypes.has(content.type)) return null;
      const embedCode = trim(content.embedCode);
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
        ['embed', buildObjValues([
          ['code', embedCode],
          ['url', cleanWebsite(getEmbedUrlFrom(embedCode), { nullOnMissingProto: true })],
        ])],
        ['credit', trim(content.credit)],
      ]);
    },
    async meta(content, _, { dbs }) {
      const statesServed = getAsArray(content.statesServed).map(trim).filter((v) => v);
      const company = content.type === 'Company' ? buildObjValues([
        ['_connection', buildObjValues([
          ['brandsCarried', LegacyDB.extractRefIds(content.brandsCarried)],
          ['competitors', LegacyDB.extractRefIds(content.companyCompetitors)],
        ])],
        ['type', trim(content.companyType)],
        ['statesServed', statesServed.length ? statesServed : null],
        ['youtube', buildObjValues([
          ['username', trim(get(content, 'youtube.username'))],
          ['channelId', trim(get(content, 'youtube.channelId'))],
          ['playlistId', trim(get(content, 'youtube.playlistId'))],
        ])],
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
      const product = content.type === 'Product' ? buildObjValues([
        ['modelNumber', trim(content.modelNumber)],
        ['status', trim(content.contentStatus)],
      ]) : null;

      let venue = null;
      if (content.type === 'Venue') {
        const cursor = await dbs.legacy.repo('platform.Content').find({
          query: { venue: content._id, type: 'Space' },
          projection: {
            capacityMin: 1,
            capacityMaxSeated: 1,
            capacityMaxStanding: 1,
            area: 1,

            floorPlanImage: 1,
          },
        });
        const spaces = await cursor.toArray();
        venue = buildObjValues([
          ['totalCapacity', trim(content.totalCapacity)],
          ['spaces', sortBy(spaces.map((space) => buildObjValues([
            ['_id', space._id],
            ['_edge', buildObjValues([
              ['floorPlan', LegacyDB.extractRefId(space.floorPlanImage)],
            ])],
            ['name', trim(space.name)],
            ['area', trim(space.area)],
            ['capacity', buildObjValues([
              ['min', trim(space.capacityMin)],
              ['maxSeated', trim(space.capacityMaxSeated)],
              ['maxStanding', trim(space.capacityMaxStanding)],
            ])],
          ])), '_id')],
        ]);
      }

      return buildObjValues([
        ['company', company],
        ['event', event],
        ['product', product],
        ['venue', venue],
      ]);
    },
    name(content) {
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
        ['canonicalUrl', cleanWebsite(get(content, 'mutations.Website.canonicalUrl'), { nullOnMissingProto: true })],
        ['noIndex', Boolean(get(content, 'mutations.Website.noIndex'))],
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
    teaser(content) {
      return buildObjValues([
        ['default', trim(content.teaser)],
        ['deck', getMutatedValue({ content, mutation: 'Magazine', field: 'deck' })],
        ['newsletter', getMutatedValue({ content, mutation: 'Email', field: 'teaser' })],
        ['magazine', getMutatedValue({ content, mutation: 'Magazine', field: 'teaser' })],
        ['website', getMutatedValue({ content, mutation: 'Website', field: 'teaser' })],
      ]);
    },
    website(content) {
      return content;
    },
  },

  /**
   *
   */
  ContentMetaCompany_Connection: {
    async brandsCarried({ brandsCarried }, _, { loaders }) {
      if (!brandsCarried.length) return [];
      const nodes = await loaders.get('platform.Content').loadMany(brandsCarried);
      return nodes.filter((c) => c && c.type === 'Company').map((node) => ({ node }));
    },
    async competitors({ competitors }, _, { loaders }) {
      if (!competitors.length) return [];
      const nodes = await loaders.get('platform.Content').loadMany(competitors);
      return nodes.filter((c) => c && c.type === 'Company').map((node) => ({ node }));
    },
  },

  /**
   *
   */
  ContentMetaVenueSpaceFloorPlanEdge: {
    node(imageId, _, { loaders }) {
      if (!imageId) return null;
      return loaders.get('platform.Image').load(imageId);
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
  ContentTypeEnum: types.get('content').toJS(),

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
  ContentWebsite: {
    description(content) {
      const paths = [
        'mutations.Website.seoDescription',
        'mutations.Website.teaser',
        'teaser',
        'mutations.Website.body',
        'body',
      ];
      return paths.reduce((value, path) => {
        if (value) return value;
        const v = cleanString(get(content, path));
        if (!v) return null;
        return encodeHtmlEntities(truncateWords({ value: v, length: 155 }));
      }, null);
    },
    gating(content) {
      const gating = getAsObject(content, 'mutations.Website.gating');
      return buildObjValues([
        ['requiredRole', trim(gating.requiredRole)],
        ['form', buildObjValues([
          ['identifier', trim(gating.surveyId)],
          ['provider', trim(gating.surveyType)],
        ])],
      ]);
    },
    async pathSuffix(content, _, { loadRefOneFrom }) {
      const primaryCategory = await loadRefOneFrom(content, {
        model: 'platform.Taxonomy',
        path: 'mutations.Website.primaryCategory',
        needs: (node) => node.status === 1,
      });
      const type = contentTypeMap.get(trim(content.type));
      if (!type) throw new Error(`Unable to find content type for ID ${content._id}`);
      return [
        cleanPath(get(primaryCategory, 'mutations.Website.urlPath')),
        type.toLowerCase().replace(/_/g, '-'),
        `${content._id}`,
        cleanPath(getMutatedValue({ content, mutation: 'Website', field: 'slug' })),
      ].filter((v) => v).join('/');
    },
    async title(content, _, { loadRefOneFrom }) {
      const company = await loadRefOneFrom(content, {
        model: 'platform.Content',
        path: 'company',
        needs: (node) => node.status === 1 && node.type === 'Company',
      });

      const create = (doc) => {
        const paths = ['mutations.Website.seoTitle', 'mutations.Website.name', 'name'];
        return paths.reduce((value, path) => {
          if (value) return value;
          const v = cleanString(get(doc, path));
          if (!v) return null;
          return encodeHtmlEntities(v);
        }, null);
      };
      const title = create(content);
      if (!title) return null;
      if (!company) return title;
      const companyTitle = create(company);
      return companyTitle ? `${title} (${companyTitle})` : title;
    },
    userRegistration(content) {
      const isRequired = Boolean(get(content, 'mutations.Website.requiresRegistration'));
      const accessLevels = getAsArray(content, 'mutations.Website.requiresAccessLevels').map(trim).filter((v) => v);
      return {
        isRequired,
        accessLevels: isRequired ? accessLevels : [],
      };
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
