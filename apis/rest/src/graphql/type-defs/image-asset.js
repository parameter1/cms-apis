import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  loadImageAssets(input: LoadManyQueryInput!): [ImageAsset!]!
    @query(kind: LOAD_MANY)
  imageAssetById(input: FindByIdQueryInput!): ImageAsset
    @query(kind: FIND_BY_ID)
  imageAssets(input: FindQueryInput = {}): [ImageAsset!]!
    @query(kind: FIND)
}

type ImageAsset @meta(
  restType: "platform/asset/image"
  repoName: "image-assets"
) {
  id: ObjectID!
  type: String!
  links: ImageAssetLinks!

  approvedMagazine: Boolean @project(field: "approvedFor.magazine")
  approvedWebsite: Boolean! @project(field: "approvedFor.website")
  body: String @project @trim
  caption: String @project @trim
  credit: String @project @trim
  cropDimensions: ImageAssetCropDimensions @project(field: "crop.dimensions")
  displayName: String @project(field: "name.display") @trim
  fileName: String! @project(field: "file.name") @trim
  filePath: String! @project(field: "file.path") @trim

  inCarousel: Boolean! @project
  isLogo: Boolean! @project
  name: String @project(field: "name.default") @trim
  notes: String @project(field: "note") @trim
  primaryImageDisplay: String! @project @trim
  source: ImageAssetSource @project(field: "file.original" needs: ["width", "height"])
  touched: DateTime @project(field: "date.touched")
}

type ImageAssetCropDimensions {
  aspectRatio: String @trim
  type: String! @trim(default: "platform/asset/image/crop")
  x1: Int
  x2: Int
  y1: Int
  y2: Int
}

type ImageAssetLinks {
  self: String!
}

type ImageAssetSource {
  height: Int
  location: String @trim
  name: String @trim
  processed: Boolean
  type: String!
  width: Int
}

`;
