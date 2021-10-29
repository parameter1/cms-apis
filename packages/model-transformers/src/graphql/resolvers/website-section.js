import { asArray, cleanPath, trim } from '@cms-apis/utils';
import { LegacyDB } from '@cms-apis/db';
import cleanString from '@cms-apis/clean-string';
import { formatStatus } from '../utils/index.js';

const loadAncestors = async (section, loaders, sections = []) => {
  const parentId = LegacyDB.extractRefId(section.parent);
  if (!parentId) return sections;
  const parent = await loaders.get('website.Section').load(parentId);
  if (!parent) return sections;
  sections.push(parent);
  return loadAncestors(parent, loaders, sections);
};

export default {
  /**
   *
   */
  WebsiteSection: {
    alias({ alias }) {
      return cleanPath(alias) || null;
    },
    canonicalPath({ alias }) {
      const cleaned = cleanPath(alias);
      if (cleaned === 'home') return '/';
      return `/${cleaned}` || null;
    },
    description({ description }) {
      return trim(description);
    },
    fullName({ fullName }) {
      return trim(fullName);
    },
    async ancestorConnection(section, _, { loaders }) {
      const sections = await loadAncestors(section, loaders, [section]);
      const edges = sections.reverse().map((node) => ({ node }));
      return { edges };
    },
    isRoot({ parent }) {
      return !parent;
    },
    labels({ labels }) {
      return asArray(labels).map(trim).filter((v) => v);
    },
    metadata(section) {
      return section;
    },
    name({ name }) {
      return trim(name);
    },
    async parentEdge(section, _, { loaders }) {
      const parentId = LegacyDB.extractRefId(section.parent);
      if (!parentId) return null;
      const node = await loaders.get('website.Section').load(parentId);
      return { node };
    },
    redirectTo() {
      return null; // placeholder. used for consistency with content.
    },
    redirects({ redirects }) {
      return asArray(redirects).map(cleanPath).filter((v) => v);
    },
    sequence({ sequence }) {
      return parseInt(sequence, 10) || 0;
    },
    slug({ slug }) {
      return trim(slug);
    },
    status({ status }) {
      return formatStatus(status);
    },
    async websiteEdge(section, _, { loaders }) {
      const siteId = LegacyDB.extractRefId(section.site);
      if (!siteId) throw new Error(`Unable to load a website ID for section ID ${section._id}`);
      const node = await loaders.get('platform.Product').load(siteId);
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
        const site = await loaders.get('platform.Product').load(siteId);
        const siteDescription = cleanString(site.description);
        if (siteDescription) return siteDescription;
        return `Articles, news, products, blogs and videos from ${site.name}.`;
      }
      return `${section.fullName || section.name} articles, news, products, blogs and videos.`;
    },
    title({ name, fullName, seoTitle }) {
      const order = [seoTitle, fullName, name].map(cleanString).filter((v) => v);
      const title = order[0];
      return title || null;
    },
  },
};
