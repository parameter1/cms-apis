import { get } from '@cms-apis/object-path';
import { trim } from '@cms-apis/utils';

export default {
  /**
   *
   */
  ImageAsset: {
    source(image) {
      return {
        height: image.height,
        name: trim(get(image, 'file.original')),
        type: 'platform/asset/image/source',
        width: image.width,
      };
    },
  },
};
