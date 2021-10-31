import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteRedirectById(input: QueryWebsiteRedirectByIdInput!): WebsiteRedirect
  websiteRedirects(input: PaginatedQueryInput = {}): QueryWebsiteRedirectsConnection!
}

type WebsiteRedirect {
  _id: ObjectID!
  from: String!
  to: String!
  code: Int!
  website: WebsiteRedirectWebsiteEdge!
}

type WebsiteRedirectWebsiteEdge {
  node: Website!
}

type QueryWebsiteRedirectsConnection {
  edges: [QueryWebsiteRedirectsConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryWebsiteRedirectsConnectionEdge {
  node: WebsiteRedirect!
  cursor: Cursor!
}

input QueryWebsiteRedirectByIdInput {
  id: Int!
}

`;
