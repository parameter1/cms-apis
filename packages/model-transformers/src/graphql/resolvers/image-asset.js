import { get } from '@cms-apis/object-path';
import { cropRectangle } from '@cms-apis/image';
import { cleanPath, isObject, trim } from '@cms-apis/utils';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  ImageAsset: {
    alt() {
      // note, this is normally generated by the website gql server
      // however, it _should_ be its own field, as such this always returns null for now
      return null;
    },
    approvedFor(image) {
      return {
        magazine: get(image, 'mutations.Magazine.approved'),
        website: get(image, 'mutations.Website.approved'),
      };
    },
    crop(image) {
      const cropDimensions = get(image, 'cropDimensions');
      const width = parseInt(image.width, 10);
      const height = parseInt(image.height, 10);
      return {
        dimensions: () => (isObject(cropDimensions) ? cropDimensions : null),
        rectangle: () => {
          if (!width || !height) return null;
          const rect = cropRectangle({ width, height, cropDimensions });
          return rect.isCropped() ? rect : null;
        },
      };
    },
    dates({ touched }) {
      return { touched };
    },
    file(image) {
      const name = trim(image.fileName);
      const path = cleanPath(image.filePath) || null;
      return { name, path };
    },
    primaryImageDisplay({ primaryImageDisplay }) {
      if (['left', 'right', 'center', 'none'].includes(primaryImageDisplay)) return primaryImageDisplay;
      return 'center';
    },
    height({ height }) {
      return parseInt(height, 10) || null;
    },
    source({ source }) {
      return isObject(source) ? source : null;
    },
    width({ width }) {
      return parseInt(width, 10) || null;
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
