import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  magazineSectionById(input: QueryMagazineSectionByIdInput!): MagazineSection
  magazineSections(input: PaginatedQueryInput = {}): QueryMagazineSectionsConnection!
}

type MagazineSection {
  _id: Int!
  _edge: MagazineSection_Edge!
  _sync: SyncInfo!
  description: String @trim
  name: MagazineSectionName!
  isGlobal: Boolean!
  sequence: Int!
}

type MagazineSection_Edge {
  issue: MagazineSectionIssueEdge
  magazine: MagazineSectionMagazineEdge!
}

type MagazineSectionIssueEdge {
  node: MagazineIssue!
}

type MagazineSectionMagazineEdge {
  node: Magazine!
}

type MagazineSectionName {
  default: String!
  full: String!
}

type QueryMagazineSectionsConnection {
  edges: [QueryMagazineSectionsConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryMagazineSectionsConnectionEdge {
  node: MagazineSection!
  cursor: Cursor!
}

input QueryMagazineSectionByIdInput {
  id: Int!
}

`;
