import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  magazineIssueById(input: QueryMagazineIssueByIdInput!): MagazineIssue
  magazineIssues(input: PaginatedQueryInput = {}): QueryMagazineIssuesConnection!
}

type MagazineIssue {
  _id: Int!
  name: String! @trim
  description: String @trim
  dedication: String @trim
  coverDescription: String @trim
  credit: String @trim

  redirects: [String!]!

  status: Int! @formatStatus

  dates: MagazineIssueDates!
  urls: MagazineIssueUrls!
  coverImage: MagazineIssueCoverImageEdge
  magazine: MagazineIssueMagazineEdge!
}

type MagazineIssueCoverImageEdge {
  node: ImageAsset!
}

type MagazineIssueDates {
  mailed: DateTime
}

type MagazineIssueMagazineEdge {
  node: Magazine!
}

type MagazineIssueUrls {
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
