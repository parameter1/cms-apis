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

export const UNDERSCORE_FIELDS = gql`
  fragment UnderscoreFieldsFragment on UnderscoreFieldsInterface {
    _meta {
      created { date by { _id name { full } username email  } }
      updated { date by { _id name { full } username email  } }
    }
    _sync { date }
    _version { n history { date by { _id } } }
  }
`;
