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

type User implements UnderscoreFieldsInterface @interfaceFields {
  _id: ObjectID!
  date: UserDate
  email: String @trim
  firstName: String @trim
  isEnabled: Boolean!
  lastName: String @trim
  mustChangePassword: Boolean!
  name: UserName
  password: String @trim
  roles: [String!]!
  username: String @trim
}

type UserDate {
  lastLoggedIn: DateTime
}

type UserName {
  first: String
  last: String
  full: String
}

`;
