import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteSectionOptionById(input: QueryWebsiteSectionOptionByIdInput!): WebsiteSectionOption
  websiteSectionOptions(input: PaginatedQueryInput = {}): QueryWebsiteSectionOptionsConnection!
}

type WebsiteSectionOption {
  _id: Int!
  name: String! @trim
  description: String @trim
  status: Int! @formatStatus
  website: WebsiteSectionOptionWebsiteEdge!
}

type WebsiteSectionOptionWebsiteEdge {
  node: Website!
}

type QueryWebsiteSectionOptionsConnection {
  edges: [QueryWebsiteSectionOptionsConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryWebsiteSectionOptionsConnectionEdge {
  node: WebsiteSectionOption!
  cursor: Cursor!
}

input QueryWebsiteSectionOptionByIdInput {
  id: Int!
}

`;
