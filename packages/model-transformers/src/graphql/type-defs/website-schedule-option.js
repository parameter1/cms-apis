import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteScheduleOptionById(input: QueryWebsiteScheduleOptionByIdInput!): WebsiteScheduleOption
  websiteScheduleOptions(input: PaginatedQueryInput = {}): QueryWebsiteScheduleOptionsConnection!
}

type WebsiteScheduleOption {
  _id: Int!
  _edge: WebsiteScheduleOption_Edge!
  _sync: SyncInfo!
  description: String @trim
  name: WebsiteScheduleOptionName!
}

type WebsiteScheduleOption_Edge {
  website: WebsiteScheduleOptionWebsiteEdge!
}

type WebsiteScheduleOptionWebsiteEdge {
  node: Website!
}

type WebsiteScheduleOptionName {
  default: String!
  full: String!
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
