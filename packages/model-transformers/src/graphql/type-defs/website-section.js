import gql from '@cms-apis/graphql/tag';

export default gql`

type WebsiteSection {
  _id: Int!
  name: String!
  description: String
  fullName: String!
  labels: [String!]!

  status: Int!

  sequence: Int!

  alias: String!
  redirects: [String!]!
  slug: String

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
