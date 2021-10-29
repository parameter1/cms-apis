import { trim } from '@cms-apis/utils';

export default {
  /**
   *
   */
  Website: {
    name({ name }) {
      return trim(name);
    },
  },
};
