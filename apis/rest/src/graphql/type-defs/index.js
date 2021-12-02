import gql from '@cms-apis/graphql/tag';

import websiteSection from './website-section.js';

export default gql`

directive @meta(
  restType: String!
  repoName: String!
) on OBJECT

directive @array(field: String) on FIELD_DEFINITION

directive @linkage(
  restType: String!
  field: String
  empty: Boolean = false
) on FIELD_DEFINITION

directive @trim(field: String, default: String) on FIELD_DEFINITION

scalar JSONObject
scalar ObjectID

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

${websiteSection}

`;
