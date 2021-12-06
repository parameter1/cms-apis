import { get } from '@cms-apis/object-path';
import { cropRectangle } from '@cms-apis/image';
import {
  cleanPath,
  isObject,
  parseNumber,
  trim,
} from '@cms-apis/utils';
import { buildObjValues, findMany } from './utils/index.js';

export default {
  /**
   *
   */
  ImageAsset: {
    _sync() {
      return {};
    },
    alt() {
      // note, this is normally generated by the website gql server
      // however, it _should_ be its own field, as such this always returns null for now
      return null;
    },
    approvedFor(image) {
      return buildObjValues([
        ['magazine', get(image, 'mutations.Magazine.approved')],
        // website approval was/is defaulted to true
        ['website', get(image, 'mutations.Website.approved') || true],
      ]);
    },
    crop(image) {
      const cropDimensions = get(image, 'cropDimensions');
      const width = parseInt(image.width, 10);
      const height = parseInt(image.height, 10);
      return buildObjValues([
        ['dimensions', isObject(cropDimensions) ? cropDimensions : null],
        ['rectangle', (() => {
          if (!width || !height) return null;
          const rect = cropRectangle({ width, height, cropDimensions });
          return rect.isCropped() ? rect : null;
        })()],
      ]);
    },
    date({ touched }) {
      return buildObjValues([
        ['touched', touched],
      ]);
    },
    file(image) {
      return {
        name: trim(image.fileName),
        path: cleanPath(image.filePath),
      };
    },
    height({ height }) {
      return parseNumber(height, { type: 'integer' });
    },
    inCarousel({ inCarousel }) {
      // force null/undefined values to false. this is/was the default
      return Boolean(inCarousel);
    },
    isLogo({ isLogo }) {
      // force null/undefined values to false. this is/was the default
      return Boolean(isLogo);
    },
    name(content) {
      return buildObjValues([
        ['default', trim(content.name)],
        ['display', trim(content.displayName)],
      ]);
    },
    primaryImageDisplay({ primaryImageDisplay }) {
      if (['left', 'right', 'center', 'none'].includes(primaryImageDisplay)) return primaryImageDisplay;
      return 'center';
    },
    width({ width }) {
      return parseNumber(width, { type: 'integer' });
    },
  },

  /**
   *
   */
  Query: {
    async imageAssetById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('platform.Image').load(id);
    },

    async imageAssets(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'platform.Image',
        after,
        limit,
        query,
        requiredFields: ['filePath', 'fileName'],
        prime: false,
      }, { dbs, loaders });
    },
  },
};
