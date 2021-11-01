import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  magazineIssueSectionById(input: QueryMagazineIssueSectionByIdInput!): MagazineIssueSection
  magazineIssueSections(input: PaginatedQueryInput = {}): QueryMagazineIssueSectionsConnection!
}

type MagazineIssueSection {
  _id: Int!
  name: String! @trim
  description: String @trim
  status: Int! @formatStatus

  sequence: Int!

  magazineIssue: MagazineIssueSectionMagazineIssueEdge!
}

type MagazineIssueSectionMagazineIssueEdge {
  node: MagazineIssue!
}

type QueryMagazineIssueSectionsConnection {
  edges: [QueryMagazineIssueSectionsConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryMagazineIssueSectionsConnectionEdge {
  node: MagazineIssueSection!
  cursor: Cursor!
}

input QueryMagazineIssueSectionByIdInput {
  id: Int!
}

`;
