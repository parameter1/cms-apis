import gql from '@cms-apis/graphql/tag';

// eslint-disable-next-line import/prefer-default-export
export const COMMON_IMAGE_ASSET_REL = gql`
  fragment CommonImageAssetRelFragment on ImageAsset {
    _id
    name { default display }
    caption
    credit
    alt
    file { name path }
    width
    height
    crop {
      dimensions { x1 x2 y1 y2 }
      rectangle { x y width height }
    }
  }
`;
