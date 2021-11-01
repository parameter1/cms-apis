import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  magazineScheduleById(input: QueryMagazineScheduleByIdInput!): MagazineSchedule
  magazineSchedules(input: PaginatedQueryInput = {}): QueryMagazineSchedulesConnection!
}

type MagazineSchedule {
  _id: ObjectID!
  status: Int! @formatStatus
  content: MagazineScheduleContentInterfaceEdge!
  section: MagazineScheduleSectionEdge!
}

type MagazineScheduleContentInterfaceEdge {
  node: ContentInterface!
}

type MagazineScheduleSectionEdge {
  node: MagazineSection!
}

type QueryMagazineSchedulesConnection {
  edges: [QueryMagazineSchedulesConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryMagazineSchedulesConnectionEdge {
  node: MagazineSchedule!
  cursor: Cursor!
}

input QueryMagazineScheduleByIdInput {
  id: Int!
}

`;
