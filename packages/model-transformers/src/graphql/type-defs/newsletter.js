import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  newsletterById(input: QueryNewsletterByIdInput!): Newsletter
  newsletters(input: PaginatedQueryInput = {}): QueryNewslettersConnection!
}

type Newsletter {
  _id: ObjectID!
  name: String! @trim
  alias: String! @trim
  tagLine: String @trim
  description: String @trim
  logo: String @trim

  status: Int! @formatStatus

  website: NewsletterWebsiteEdge!
}

type NewsletterWebsiteEdge {
  node: Website!
}

type QueryNewslettersConnection {
  edges: [QueryNewslettersConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryNewslettersConnectionEdge {
  node: Newsletter!
  cursor: Cursor!
}

input QueryNewsletterByIdInput {
  id: Int!
}

`;
