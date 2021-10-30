import gql from '@cms-apis/graphql/tag';
import batchReplace from '../batch-replace.js';

export default async ({ dbs, graphql }) => batchReplace({
  graphql,
  operation: 'imageAssets',
  upsertTo: dbs.main.repo('image-assets'),
  fragment: gql`
    fragment TransformImageAssetFragment on ImageAsset {
      _id
      name
      caption
      credit
      isLogo
      body
      width
      height
      alt
      primaryImageDisplay
      file { name path }
      approvedFor { website magazine }
      crop {
        dimensions { x1 x2 y1 y2 aspectRatio }
        rectangle { x y width height }
      }
      source { location name width height processed }
    }
  `,
});
