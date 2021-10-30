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
  site: WebsiteRedirectSiteEdge!
}

type WebsiteRedirectSiteEdge {
  node: WebsiteSite!
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
