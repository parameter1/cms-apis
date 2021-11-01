import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  magazineIssueSectionById(input: QueryMagazineIssueSectionByIdInput!): MagazineIssueSection
  magazineIssueSections(input: PaginatedQueryInput = {}): QueryMagazineIssueSectionsConnection!
}

type MagazineIssueSection {
  _id: Int!
  name: String!
  description: String @trim
  status: Int! @formatStatus

  sequence: Int!

  issue: MagazineIssueSectionIssueEdge!
}

type MagazineIssueSectionIssueEdge {
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
