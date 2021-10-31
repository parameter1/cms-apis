import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  newsletterSectionById(input: QueryNewsletterSectionByIdInput!): NewsletterSection
  newsletterSections(input: PaginatedQueryInput = {}): QueryNewsletterSectionsConnection!
}

type NewsletterSection {
  _id: Int!
  name: String! @trim
  description: String @trim
  fullName: String @trim

  status: Int! @formatStatus

  sequence: Int!

  newsletter: NewsletterSectionNewsletterEdge!

  seoTitle: String @trim
  alias: String @trim
  redirects: [String!]!
  slug: String @trim
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
