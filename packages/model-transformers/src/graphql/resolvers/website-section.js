import { asArray, cleanPath, trim } from '@cms-apis/utils';
import { LegacyDB } from '@cms-apis/db';
import cleanString, { cleanWebsite } from '@cms-apis/clean-string';
import { buildObjValues, findMany } from './utils/index.js';
import { sortBy } from '../utils/index.js';

const loadAncestors = async (section, loaders, sections = []) => {
  const parentId = LegacyDB.extractRefId(section.parent);
  if (!parentId) return sections;
  const parent = await loaders.get('website.Section').load(parentId);
  if (!parent) return sections;
  sections.push(parent);
  return loadAncestors(parent, loaders, sections);
};

const loadDescendants = async (section, loaders, sections = []) => {
  const children = await loaders.descendantWebsiteSections.load(section._id);
  if (!children.length) return sections;
  sections.push(...children.map((child) => child));
  await Promise.all(children.map((child) => loadDescendants(child, loaders, sections)));
  return sections;
};

const getDepthFor = (section) => {
  const alias = cleanPath(section.alias) || null;
  return alias ? alias.split('/').length : 0;
};

export default {
  /**
   *
   */
  WebsiteSection: {
    _connection(section, _, { loaders }) {
      return {
        async ancestors() {
          const sections = await loadAncestors(section, loaders, []);
          return sections.reverse().map((node) => ({
            depth: getDepthFor(node),
            node,
          }));
        },
        async descendants() {
          const currentDepth = getDepthFor(section);
          const sections = await loadDescendants(section, loaders, []);
          return sortBy(sections, 'fullName').map((node) => ({
            depth: getDepthFor(node) - currentDepth,
            node,
          }));
        },
        async related() {
          const sectionIds = LegacyDB.extractRefIds(section.relatedSections);
          if (!sectionIds.length) return [];
          const docs = await loaders.get('website.Section').loadMany(sectionIds);
          return sortBy(docs, '_id').filter((node) => node).map((node) => ({ node }));
        },
      };
    },
    _edge(section, _, { loaders }) {
      return {
        async coverImage() {
          const imageId = LegacyDB.extractRefId(section.coverImage);
          if (!imageId) return null;
          const node = await loaders.get('platform.Image').load(imageId);
          if (!node) return null;
          return { node };
        },
        async logo() {
          const imageId = LegacyDB.extractRefId(section.logo);
          if (!imageId) return null;
          const node = await loaders.get('platform.Image').load(imageId);
          if (!node) return null;
          return { node };
        },
        async parent() {
          const parentId = LegacyDB.extractRefId(section.parent);
          if (!parentId) return null;
          const node = await loaders.get('website.Section').load(parentId);
          if (!node) return null;
          return { node };
        },
        async website() {
          const siteId = LegacyDB.extractRefId(section.site);
          if (!siteId) throw new Error(`Unable to load a site ID for section ID ${section._id}`);
          const node = await loaders.get('website.Site').load(siteId);
          return { node };
        },
      };
    },
    _sync() {
      return {};
    },
    alias({ alias }) {
      return cleanPath(alias) || null;
    },
    depth(section) {
      return getDepthFor(section);
    },
    labels({ labels }) {
      return asArray(labels).map(trim).filter((v) => v);
    },
    metadata(section) {
      return section;
    },
    name(section) {
      return buildObjValues([
        ['default', trim(section.name)],
        ['full', trim(section.fullName)],
      ]);
    },
    redirects({ redirects }) {
      return asArray(redirects).map(cleanPath).filter((v) => v);
    },
    seo(section) {
      return buildObjValues([
        ['title', trim(section.seoTitle)],
        ['description', trim(section.seoDescription)],
        ['canonicalUrl', cleanWebsite(section.canonicalUrl, { nullOnMissingProto: true })],
      ]);
    },
    sequence({ sequence }) {
      return parseInt(sequence, 10) || 0;
    },
  },

  /**
   *
   */
  WebsiteSectionMetadata: {
    async description(section, _, { loaders }) {
      const alias = cleanPath(section.alias);
      const description = cleanString(section.description);
      const seoDescription = cleanString(section.seoDescription);
      if (seoDescription) return seoDescription;
      if (description) return description;
      if (alias === 'home') {
        const siteId = LegacyDB.extractRefId(section.site);
        if (!siteId) throw new Error(`Unable to extract a site ID for section ID ${section._id}`);
        const site = await loaders.get('website.Site').load(siteId);
        const siteDescription = cleanString(site.description);
        if (siteDescription) return siteDescription;
        return `Articles, news, products, blogs and videos from ${site.name}.`;
      }
      return `${section.name} articles, news, products, blogs and videos.`;
    },
    title({ name, fullName, seoTitle }) {
      const order = [seoTitle, fullName, name].map(cleanString).filter((v) => v);
      const title = order[0];
      return title || null;
    },
  },

  /**
   *
   */
  Query: {
    async websiteSectionById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('website.Section').load(id);
    },

    async websiteSections(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'website.Section',
        after,
        limit,
        query,
      }, { dbs, loaders });
    },
  },
};
