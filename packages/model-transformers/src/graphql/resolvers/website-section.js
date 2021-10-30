import { asArray, cleanPath, trim } from '@cms-apis/utils';
import { LegacyDB } from '@cms-apis/db';
import cleanString from '@cms-apis/clean-string';
import findMany from './utils/find-many.js';
import { sortBy } from '../utils/index.js';

const loadAncestors = async (section, loaders, sections = []) => {
  const parentId = LegacyDB.extractRefId(section.parent);
  if (!parentId) return sections;
  const parent = await loaders.get('website.Section').load(parentId);
  if (!parent) return sections;
  sections.push(parent);
  return loadAncestors(parent, loaders, sections);
};

const loadDescendants = async (section, repo, sections = []) => {
  const cursor = await repo.find({ query: { 'parent.$id': section._id } });
  const children = await cursor.toArray();
  if (!children.length) return sections;
  sections.push(...children);
  await Promise.all(children.map((child) => loadDescendants(child, repo, sections)));
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
    alias({ alias }) {
      return cleanPath(alias) || null;
    },
    async ancestors(section, _, { loaders }) {
      const sections = await loadAncestors(section, loaders, []);
      return sections.reverse().map((node) => ({
        depth: getDepthFor(node),
        node,
      }));
    },
    async coverImage(section, _, { loaders }) {
      const imageId = LegacyDB.extractRefId(section.coverImage);
      if (!imageId) return null;
      const node = await loaders.get('platform.Image').load(imageId);
      if (!node) return null;
      return { node };
    },
    depth(section) {
      return getDepthFor(section);
    },
    async descendants(section, _, { dbs }) {
      const currentDepth = getDepthFor(section);
      const sections = await loadDescendants(section, dbs.legacy.repo('website.Section'), []);
      return sortBy(sections, 'fullName').map((node) => ({
        depth: getDepthFor(node) - currentDepth,
        node,
      }));
    },
    labels({ labels }) {
      return asArray(labels).map(trim).filter((v) => v);
    },
    async logo(section, _, { loaders }) {
      const imageId = LegacyDB.extractRefId(section.logo);
      if (!imageId) return null;
      const node = await loaders.get('platform.Image').load(imageId);
      if (!node) return null;
      return { node };
    },
    metadata(section) {
      return section;
    },
    async parent(section, _, { loaders }) {
      const parentId = LegacyDB.extractRefId(section.parent);
      if (!parentId) return null;
      const node = await loaders.get('website.Section').load(parentId);
      if (!node) return null;
      return { node };
    },
    redirects({ redirects }) {
      return asArray(redirects).map(cleanPath).filter((v) => v);
    },
    sequence({ sequence }) {
      return parseInt(sequence, 10) || 0;
    },
    async site(section, _, { loaders }) {
      const siteId = LegacyDB.extractRefId(section.site);
      if (!siteId) throw new Error(`Unable to load a site ID for section ID ${section._id}`);
      const node = await loaders.get('website.Site').load(siteId);
      return { node };
    },
  },

  /**
   *
   */
  WebsiteSectionMetadata: {
    async description(section, _, { loaders }) {
      const alias = cleanPath(section.alias);
      const description = cleanString(section.description);
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
