import gql from '@cms-apis/graphql/tag';

export default gql`

type WebsiteSection {
  _id: Int!
  name: String! @trim
  description: String @trim
  fullName: String! @trim
  labels: [String!]!

  status: Int! @formatStatus

  sequence: Int!

  alias: String!
  redirects: [String!]!
  slug: String @trim

  metadata: WebsiteSectionMetadata!

  canonicalPath: String!
  redirectTo: String!
  ancestorConnection: WebsiteSectionAncestorConnection!

  isRoot: Boolean!

  parentEdge: WebsiteSectionParentEdge
  siteEdge: WebsiteSectionSiteEdge!
}

type WebsiteSectionAncestorConnection {
  edges: [WebsiteSectionAncestorConnectionEdge!]!
}

type WebsiteSectionAncestorConnectionEdge {
  node: WebsiteSection!
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

`;
