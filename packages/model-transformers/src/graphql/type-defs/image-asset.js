import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  imageAssetById(input: QueryImageAssetByIdInput!): ImageAsset
  imageAssets(input: PaginatedQueryInput = {}): QueryImageAssetsConnection!
}

type ImageAsset {
  _id: ObjectID!
  "Name now uses display name. No need for the name to also be the file name"
  name: String @trim(field: "displayName")

  caption: String @trim
  credit: String @trim
  isLogo: Boolean
  body: String @trim


  width: Int
  height: Int

  # note, this is normally generated by the website gql server
  # however, it _should_ be its own field, as such this always returns null for now
  alt: String

  # this should really be a field on the rel between content and the primary image
  # for now, it's being left as-is
  primaryImageDisplay: String!

  dates: ImageAssetDates!
  file: ImageAssetFile!
  approvedFor: ImageAssetApprovedFor!
  crop: ImageAssetCrop!
  source: ImageAssetSource
}

type ImageAssetCrop {
  dimensions: ImageAssetCropDimensions
  # @todo this will set an empty object if the image width/height is not available!
  rectangle: ImageAssetCropRectangle
}

type ImageAssetCropDimensions {
  x1: Int
  x2: Int
  y1: Int
  y2: Int
  aspectRatio: String
}

type ImageAssetCropRectangle {
  x: Int!
  y: Int!
  width: Int!
  height: Int!
}

type ImageAssetDates {
  touched: DateTime
}

type ImageAssetFile {
  name: String!
  path: String!
}

type ImageAssetSource {
  location: String
  name: String
  width: Int
  height: Int
  processed: Boolean
}

type ImageAssetApprovedFor {
  magazine: Boolean
  website: Boolean
}

type QueryImageAssetsConnection {
  edges: [QueryImageAssetsConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryImageAssetsConnectionEdge {
  node: ImageAsset!
  cursor: Cursor!
}

input QueryImageAssetByIdInput {
  id: Int!
}

`;
