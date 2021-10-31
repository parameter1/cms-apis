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
  email: String @trim
  name: String
  firstName: String @trim
  lastName: String @trim
  username: String @trim
  roles: [String!]!

  password: String @trim

  lastLoggedIn: DateTime

  enabled: Boolean!
  mustChangePassword: Boolean!
}

`;
