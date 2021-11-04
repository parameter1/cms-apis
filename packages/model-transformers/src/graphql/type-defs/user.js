import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  userById(input: QueryUserByIdInput!): User
  users(input: PaginatedQueryInput = {}): QueryUsersConnection!
}

type QueryUsersConnection {
  edges: [QueryUsersConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryUsersConnectionEdge {
  node: User!
  cursor: Cursor!
}

input QueryUserByIdInput {
  id: Int!
}

type User {
  _id: ObjectID!
  _sync: SyncInfo!
  date: UserDate
  email: String @trim
  firstName: String @trim
  isEnabled: Boolean!
  lastName: String @trim
  mustChangePassword: Boolean!
  name: String
  password: String @trim
  roles: [String!]!
  username: String @trim
}

type UserDate {
  lastLoggedIn: DateTime
}

`;
