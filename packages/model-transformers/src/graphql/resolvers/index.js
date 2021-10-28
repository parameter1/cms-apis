import merge from 'lodash.merge';

import platformContent from './platform-content.js';
import websiteSection from './website-section.js';

export default merge({
  /**
   *
   */
  Query: {
    /**
     *
     */
    ping() {
      return 'pong';
    },
  },
}, platformContent, websiteSection);
