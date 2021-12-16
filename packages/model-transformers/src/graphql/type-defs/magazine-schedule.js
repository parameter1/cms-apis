import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  magazineScheduleById(input: QueryMagazineScheduleByIdInput!): MagazineSchedule
  magazineSchedules(input: PaginatedQueryInput = {}): QueryMagazineSchedulesConnection!
}

type MagazineSchedule implements UnderscoreFieldsInterface @interfaceFields {
  _id: ObjectID!
  _edge: MagazineSchedule_Edge!
}

type MagazineSchedule_Edge {
  content: MagazineScheduleContentEdge!
  section: MagazineScheduleSectionEdge!
}

type MagazineScheduleContentEdge {
  node: Content!
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
