import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  emailNewsletterById(input: QueryEmailNewsletterByIdInput!): EmailNewsletter
  emailNewsletters(input: PaginatedQueryInput = {}): QueryEmailNewslettersConnection!
}

type EmailNewsletter {
  _id: ObjectID!
  name: String! @trim
  alias: String! @trim
  tagLine: String @trim
  description: String @trim
  logo: String @trim

  status: Int! @formatStatus

  website: EmailNewsletterWebsiteEdge!
}

type EmailNewsletterWebsiteEdge {
  node: Website!
}

type QueryEmailNewslettersConnection {
  edges: [QueryEmailNewslettersConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryEmailNewslettersConnectionEdge {
  node: EmailNewsletter!
  cursor: Cursor!
}

input QueryEmailNewsletterByIdInput {
  id: Int!
}

`;
