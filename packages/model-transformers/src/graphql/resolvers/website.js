import { trim } from '@cms-apis/utils';
import { CDN_ASSET_HOSTNAME, CDN_IMAGE_HOSTNAME } from '../../env.js';

export default {
  /**
   *
   */
  Website: {
    description({ description }) {
      return trim(description);
    },
    fullName({ fullName }) {
      return trim(fullName);
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
    logo({ logo }) {
      return trim(logo);
    },
    name({ name }) {
      return trim(name);
    },
    origin(site) {
      const host = trim(site.host);
      return host ? `https://${host}` : null;
    },
    shortName({ shortName }) {
      return trim(shortName);
    },
    status({ status }) {
      return parseInt(status, 10) || null;
    },
    tagLine({ tagLine }) {
      return trim(tagLine);
    },
    title(site) {
      const name = trim(site.name);
      const shortName = trim(site.shortName);
      if (!shortName) return name;
      return name ? `${name} (${shortName})` : null;
    },
    url({ url }) {
      return trim(url);
    },
  },

  /**
   *
   */
  Query: {
    async websiteById(_, { input }, { loaders }) {
      const { id } = input;
      const product = await loaders.get('platform.Product').load(id);
      if (product.type !== 'Site') throw new Error(`The product returned for ID ${id} is not a website.`);
      return product;
    },
  },
};
