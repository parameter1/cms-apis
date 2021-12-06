import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteScheduleById(input: QueryWebsiteScheduleByIdInput!): WebsiteSchedule
  websiteSchedules(input: PaginatedQueryInput = {}): QueryWebsiteSchedulesConnection!
}

type WebsiteSchedule {
  _id: ObjectID!
  _connection: WebsiteSchedule_Connection!
  _edge: WebsiteSchedule_Edge!
  _sync: SyncInfo!
  date: WebsiteScheduleDate!
  status: Int! @formatStatus
}

type WebsiteSchedule_Connection {
  taxonomies: [WebsiteScheduleTaxonomiesEdge!]!
}

type WebsiteSchedule_Edge {
  content: WebsiteScheduleContentEdge!
  section: WebsiteScheduleSectionEdge!
  option: WebsiteScheduleOptionEdge!
}

type WebsiteScheduleContentEdge {
  node: Content!
}

type WebsiteScheduleDate {
  started: DateTime!
  ended: DateTime
}

type WebsiteScheduleOptionEdge {
  node: WebsiteScheduleOption!
}

type WebsiteScheduleSectionEdge {
  node: WebsiteSection!
}

type WebsiteScheduleTaxonomiesEdge {
  node: Taxonomy!
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
