import { get } from '@cms-apis/object-path';

export default {
  /**
   *
   */
  Website: {
    /**
     * No longer used in new data structure.
     */
    fullName({ name }) {
      return name ? `Site: ${name}` : null;
    },
    /**
     * No longer used in new data structure.
     */
    sequence() {
      return 0;
    },
    /**
     * No longer used in new data structure.
     */
    url(website) {
      const host = get(website, 'host.root');
      if (!host) return null;
      return host.replace(/^www./i, '');
    },
  },
};
