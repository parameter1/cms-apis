import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteScheduleById(input: QueryWebsiteScheduleByIdInput!): WebsiteSchedule
  websiteSchedules(input: PaginatedQueryInput = {}): QueryWebsiteSchedulesConnection!
}

type WebsiteSchedule {
  _id: ObjectID!
  status: Int! @formatStatus

  dates: WebsiteScheduleDates!
  content: WebsiteScheduleContentInterfaceEdge!
  section: WebsiteScheduleSectionEdge!
  option: WebsiteScheduleOptionEdge!
}

type WebsiteScheduleContentInterfaceEdge {
  node: ContentInterface!
}

type WebsiteScheduleDates {
  start: DateTime!
  end: DateTime
}

type WebsiteScheduleOptionEdge {
  node: WebsiteScheduleOption!
}

type WebsiteScheduleSectionEdge {
  node: WebsiteSection!
}

type QueryWebsiteSchedulesConnection {
  edges: [QueryWebsiteSchedulesConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryWebsiteSchedulesConnectionEdge {
  node: WebsiteSchedule!
  cursor: Cursor!
}

input QueryWebsiteScheduleByIdInput {
  id: Int!
}

`;
