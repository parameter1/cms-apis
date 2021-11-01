import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  magazineById(input: QueryMagazineByIdInput!): Magazine
  magazines(input: PaginatedQueryInput = {}): QueryMagazinesConnection!
}

type Magazine {
  _id: ObjectID!
  name: String! @trim
  tagLine: String @trim
  description: String @trim
  logo: String @trim

  status: Int! @formatStatus

  urls: MagazineUrls!
  coverImage: MagazineCoverImageEdge

  issues: [MagazineIssuesEdge!]!
  sections: [MagazineSectionsEdge!]!
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

type MagazineUrls {
  subscribe: String @trim
  renewal: String @trim
  reprints: String @trim
  einquiry: String @trim
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
