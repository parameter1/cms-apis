import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteSectionById(input: QueryWebsiteSectionByIdInput!): WebsiteSection
  websiteSections(input: PaginatedQueryInput = {}): QueryWebsiteSectionsConnection!
}

type QueryWebsiteSectionsConnection {
  edges: [QueryWebsiteSectionsConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryWebsiteSectionsConnectionEdge {
  node: WebsiteSection!
  cursor: Cursor!
}

type WebsiteSection {
  _id: Int!
  _connection: WebsiteSection_Connection!
  _edge: WebsiteSection_Edge!
  _sync: SyncInfo!
  alias: String!
  deleted: Boolean! @formatDeleted
  depth: Int!
  description: String @trim
  labels: [String!]!
  metadata: WebsiteSectionMetadata!
  name: WebsiteSectionName!
  redirects: [String!]!
  sequence: Int!
  seo: WebsiteSectionSEO
  slug: String!
}

type WebsiteSection_Connection {
  ancestors: [WebsiteSectionAncestorsEdge!]!
  descendants: [WebsiteSectionDescendantsEdge!]!
  related: [WebsiteSectionRelatedEdge!]!
}

type WebsiteSectionAncestorsEdge {
  node: WebsiteSection!
  depth: Int!
}

type WebsiteSectionDescendantsEdge {
  node: WebsiteSection!
  depth: Int!
}

type WebsiteSection_Edge {
  coverImage: WebsiteSectionCoverImageEdge
  logo: WebsiteSectionLogoEdge
  parent: WebsiteSectionParentEdge
  website: WebsiteSectionWebsiteEdge!
}

type WebsiteSectionLogoEdge {
  node: ImageAsset!
}

type WebsiteSectionCoverImageEdge {
  node: ImageAsset!
}

type WebsiteSectionMetadata {
  title: String!
  description: String
}

type WebsiteSectionName {
  default: String!
  full: String!
}

type WebsiteSectionParentEdge {
  node: WebsiteSection!
}

type WebsiteSectionRelatedEdge {
  node: WebsiteSection!
}

type WebsiteSectionSEO {
  title: String
  canonicalUrl: String
  description: String
}

type WebsiteSectionWebsiteEdge {
  node: Website!
}

input QueryWebsiteSectionByIdInput {
  id: Int!
}

`;
