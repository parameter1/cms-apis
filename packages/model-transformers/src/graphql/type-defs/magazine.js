import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  magazineById(input: QueryMagazineByIdInput!): Magazine
  magazines(input: PaginatedQueryInput = {}): QueryMagazinesConnection!
}

type Magazine {
  _id: ObjectID!
  _connection: Magazine_Connection!
  _edge: Magazine_Edge!
  _sync: SyncInfo!
  description: String @trim
  logo: String @trim
  name: String! @trim
  status: Int! @formatStatus
  tagLine: String @trim
  url: MagazineUrl!
}

type Magazine_Connection {
  issues: [MagazineIssuesEdge!]!
  sections: [MagazineSectionsEdge!]!
}

type Magazine_Edge {
  coverImage: MagazineCoverImageEdge
}

type MagazineCoverImageEdge {
  node: ImageAsset!
}

type MagazineIssuesEdge {
  node: MagazineIssue!
}

type MagazineSectionsEdge {
  node: MagazineSection!
}

type MagazineUrl {
  subscribe: String
  renewal: String
  reprint: String
  einquiry: String
}

type QueryMagazinesConnection {
  edges: [QueryMagazinesConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryMagazinesConnectionEdge {
  node: Magazine!
  cursor: Cursor!
}

input QueryMagazineByIdInput {
  id: Int!
}

`;
