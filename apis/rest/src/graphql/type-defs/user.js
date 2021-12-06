import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  loadUsers(input: LoadManyQueryInput!): [User!]!
    @query(kind: LOAD_MANY)
  userById(input: FindByIdQueryInput!): User
    @query(kind: FIND_BY_ID)
  users(input: FindQueryInput = {}): [User!]!
    @query(kind: FIND)
}

type User @meta(
  restType: "platform/security/user"
  repoName: "users"
) {
  id: ObjectID!
  type: String!
  links: UserLinks!

  accountNonExpired: Boolean! # no longer used, always true
  accountNonLocked: Boolean! # no longer used, always true
  address1: String @trim # no longer used, always null
  address2: String @trim # no longer used, always null
  city: String @trim # no longer used, always null
  companyName: String @trim # no longer used, always null
  country: String @trim # no longer used, always null
  credentialsNonExpired: Boolean! # no longer used, always true
  displayName: String @trim # no longer used, always null
  email: String @project @trim
  enabled: Boolean! @project(field: "mustChangePassword")
  externalMetadata: String @trim # no longer used, always null
  fax: String @trim # no longer used, always null
  firstName: String @project(field: "name.first") @trim
  lastLoggedIn: DateTime @project(field: "date.lastLoggedIn")
  lastName: String @project(field: "name.last") @trim
  mobile: String @trim # no longer used, always null
  mustChange: Boolean! @project(field: "mustChangePassword")
  password: String @project @trim # will be redacted
  phone: String @trim # no longer used, always null
  picture: String @trim # no longer used, always null
  postalCode: String @trim # no longer used, always null
  region: String @trim # no longer used, always null
  roles: [String!]! @project @array
  salt: String @trim # no longer used, always null
  title: String @trim # no longer used, always null
  username: String @project @trim
  website: String @trim # no longer used, always null
}

type UserLinks {
  self: String!
  # no longer used
  groups: LinkMany! @linkage(
    restType: "platform/security/group"
    empty: true
  )
}

`;
