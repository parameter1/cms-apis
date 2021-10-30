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
  name: String! @trim
  description: String @trim
  fullName: String! @trim
  labels: [String!]!

  depth: Int!
  status: Int! @formatStatus

  sequence: Int!

  alias: String!
  redirects: [String!]!
  slug: String @trim

  metadata: WebsiteSectionMetadata!

  ancestors: [WebsiteSectionAncestorEdge!]!
  descendants: [WebsiteSectionDescendantEdge!]!

  parent: WebsiteSectionParentEdge
  site: WebsiteSectionSiteEdge!
}

type WebsiteSectionAncestorEdge {
  node: WebsiteSection!
  depth: Int!
}

type WebsiteSectionDescendantEdge {
  node: WebsiteSection!
  depth: Int!
}

type WebsiteSectionMetadata {
  title: String!
  description: String
}

type WebsiteSectionParentEdge {
  node: WebsiteSection!
}

type WebsiteSectionSiteEdge {
  node: WebsiteSite!
}

input QueryWebsiteSectionByIdInput {
  id: Int!
}

`;
