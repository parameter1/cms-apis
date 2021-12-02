import gql from '@cms-apis/graphql/tag';

import websiteSection from './website-section.js';

export default gql`

directive @meta(
  restType: String!
  repoName: String!
) on OBJECT

directive @query(
  kind: RestQueryKindEnum!
) on FIELD_DEFINITION

directive @array(field: String) on FIELD_DEFINITION

directive @linkage(
  restType: String!
  field: String
  empty: Boolean = false
) on FIELD_DEFINITION

directive @trim(field: String, default: String) on FIELD_DEFINITION

scalar JSONObject
scalar ObjectID

enum RestQueryKindEnum {
  FIND_BY_ID
  FIND
}

type Query {
  ping: String!
}

type Mutation {
  ping: String!
}

type IntLinkOne {
  self: String
  related: String
  linkage: IntLinkage
}

type IntLinkMany {
  self: String
  related: String
  linkage: [IntLinkage!]!
}

type ObjectIDLinkOne {
  self: String
  related: String
  linkage: ObjectIDLinkage
}

type ObjectIDLinkMany {
  self: String
  related: String
  linkage: [ObjectIDLinkage!]!
}

type IntLinkage {
  id: Int!
  type: String!
}

type ObjectIDLinkage {
  id: ObjectID!
  type: String!
}

input FindByIdQueryInput {
  id: Int!
}

input FindQueryInput {
  ids: [Int!]! = []
}

# input QueryByIdIntInput {
#   id: Int!
# }

# input QueryManyIntInput {
#   ids: [Int!]! = []
# }

# input QueryByIdObjectIDInput {
#   id: Int!
# }

# input QueryManyObjectIDInput {
#   ids: [ObjectID!]! = []
# }

${websiteSection}

`;
