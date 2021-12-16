import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  magazineIssueById(input: QueryMagazineIssueByIdInput!): MagazineIssue
  magazineIssues(input: PaginatedQueryInput = {}): QueryMagazineIssuesConnection!
}

type MagazineIssue implements UnderscoreFieldsInterface @interfaceFields {
  _id: Int!
  _edge: MagazineIssue_Edge!
  coverDescription: String @trim
  credit: String @trim
  date: MagazineIssueDate!
  dedication: String @trim
  description: String @trim
  name: MagazineIssueName!
  url: MagazineIssueUrl
}

type MagazineIssue_Edge {
  coverImage: MagazineIssueCoverImageEdge
  magazine: MagazineIssueMagazineEdge!
}

type MagazineIssueCoverImageEdge {
  node: ImageAsset!
}

type MagazineIssueDate {
  mailed: DateTime
}

type MagazineIssueMagazineEdge {
  node: Magazine!
}

type MagazineIssueName {
  default: String!
  full: String!
}

type MagazineIssueUrl {
  digitalEdition: String @trim
}

type QueryMagazineIssuesConnection {
  edges: [QueryMagazineIssuesConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryMagazineIssuesConnectionEdge {
  node: MagazineIssue!
  cursor: Cursor!
}

input QueryMagazineIssueByIdInput {
  id: Int!
}

`;
