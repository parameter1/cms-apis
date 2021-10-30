import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteOptionById(input: QueryWebsiteOptionByIdInput!): WebsiteOption
  websiteOptions(input: PaginatedQueryInput = {}): QueryWebsiteOptionsConnection!
}

type WebsiteOption {
  _id: Int!
  name: String! @trim
  description: String @trim
  status: Int! @formatStatus
  site: WebsiteOptionSiteEdge!
}

type WebsiteOptionSiteEdge {
  node: WebsiteSite!
}

type QueryWebsiteOptionsConnection {
  edges: [QueryWebsiteOptionsConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryWebsiteOptionsConnectionEdge {
  node: WebsiteOption!
  cursor: Cursor!
}

input QueryWebsiteOptionByIdInput {
  id: Int!
}

`;
