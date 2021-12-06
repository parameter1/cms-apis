import { get } from '@cms-apis/object-path';

export default {
  /**
   *
   */
  WebsiteSchedule: {
    /**
     *
     */
    hasPrimaryImage(schedule) {
      return Boolean(get(schedule, '_edge.content.node._edge.primaryImage.node._id'));
    },
  },
};
