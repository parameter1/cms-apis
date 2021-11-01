import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  magazineSectionById(input: QueryMagazineSectionByIdInput!): MagazineSection
  magazineSections(input: PaginatedQueryInput = {}): QueryMagazineSectionsConnection!
}

type MagazineSection {
  _id: Int!
  name: String! @trim
  description: String @trim
  status: Int! @formatStatus

  sequence: Int!

  magazine: MagazineSectionMagazineEdge!
}

type MagazineSectionMagazineEdge {
  node: Magazine!
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
