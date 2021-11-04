import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteRedirectById(input: QueryWebsiteRedirectByIdInput!): WebsiteRedirect
  websiteRedirects(input: PaginatedQueryInput = {}): QueryWebsiteRedirectsConnection!
}

type WebsiteRedirect {
  _id: ObjectID!
  _edge: WebsiteRedirect_Edge
  _sync: SyncInfo!
  code: Int!
  from: String!
  to: String!
}

type WebsiteRedirect_Edge {
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
