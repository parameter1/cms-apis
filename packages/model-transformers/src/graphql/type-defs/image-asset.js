import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  imageAssetById(input: QueryImageAssetByIdInput!): ImageAsset
  imageAssets(input: PaginatedQueryInput = {}): QueryImageAssetsConnection!
}

type ImageAsset implements UnderscoreFieldsInterface @interfaceFields {
  _id: ObjectID!
  # note, this is normally generated by the website gql server
  # however, it _should_ be its own field, as such this always returns null for now
  alt: String
  approvedFor: ImageAssetApprovedFor!
  body: String @trim
  caption: String @trim
  credit: String @trim
  crop: ImageAssetCrop
  date: ImageAssetDate
  file: ImageAssetFile!
  height: Int
  # this should really be a field on the rel between content and the image
  inCarousel: Boolean!
  isLogo: Boolean!
  name: ImageAssetName
  note: String @trim(field: "notes")
  # this should really be a field on the rel between content and the primary image
  # for now, it's being left as-is
  primaryImageDisplay: String!
  width: Int
}

type ImageAssetApprovedFor {
  magazine: Boolean
  website: Boolean
}

type ImageAssetCrop {
  dimensions: ImageAssetCropDimensions
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

type ImageAssetDate {
  touched: DateTime
}

type ImageAssetFile {
  name: String!
  path: String!
  original: String
}

type ImageAssetName {
  default: String
  display: String
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
