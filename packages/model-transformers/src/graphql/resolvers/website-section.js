import { asArray, cleanPath, trim } from '@cms-apis/utils';
import cleanString from '@cms-apis/clean-string';

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
      return cleaned || null;
    },
    description({ description }) {
      return trim(description);
    },
    fullName({ fullName }) {
      return trim(fullName);
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
      return parseInt(status, 10) || null;
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
        const site = await loaders.get('platform.Product').load(section.site.oid);
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
