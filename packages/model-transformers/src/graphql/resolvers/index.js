import merge from 'lodash.merge';

import platformContent from './platform-content.js';

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
}, platformContent);
