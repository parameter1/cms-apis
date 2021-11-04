import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  newsletterSectionById(input: QueryNewsletterSectionByIdInput!): NewsletterSection
  newsletterSections(input: PaginatedQueryInput = {}): QueryNewsletterSectionsConnection!
}

type NewsletterSection {
  _id: Int!
  _edge: NewsletterSection_Edge!
  _sync: SyncInfo!
  alias: String @trim
  description: String @trim
  name: NewsletterSectionName!
  sequence: Int!
  status: Int! @formatStatus
}

type NewsletterSection_Edge {
  newsletter: NewsletterSectionNewsletterEdge!
}

type NewsletterSectionName {
  default: String!
  full: String
}

type NewsletterSectionNewsletterEdge {
  node: Newsletter!
}

type QueryNewsletterSectionsConnection {
  edges: [QueryNewsletterSectionsConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryNewsletterSectionsConnectionEdge {
  node: NewsletterSection!
  cursor: Cursor!
}

input QueryNewsletterSectionByIdInput {
  id: Int!
}

`;
