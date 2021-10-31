import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteScheduleOptionById(input: QueryWebsiteScheduleOptionByIdInput!): WebsiteScheduleOption
  websiteScheduleOptions(input: PaginatedQueryInput = {}): QueryWebsiteScheduleOptionsConnection!
}

type WebsiteScheduleOption {
  _id: Int!
  name: String! @trim
  description: String @trim
  status: Int! @formatStatus
  website: WebsiteScheduleOptionWebsiteEdge!
}

type WebsiteScheduleOptionWebsiteEdge {
  node: Website!
}

type QueryWebsiteScheduleOptionsConnection {
  edges: [QueryWebsiteScheduleOptionsConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryWebsiteScheduleOptionsConnectionEdge {
  node: WebsiteScheduleOption!
  cursor: Cursor!
}

input QueryWebsiteScheduleOptionByIdInput {
  id: Int!
}

`;
