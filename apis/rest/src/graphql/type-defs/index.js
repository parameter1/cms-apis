import gql from '@cms-apis/graphql/tag';

import websiteSection from './website-section.js';

export default gql`

directive @modelMeta(type: String!) on OBJECT

directive @array(field: String) on FIELD_DEFINITION
directive @linkage(type: String!) on FIELD_DEFINITION
directive @trim(field: String, default: String) on FIELD_DEFINITION

scalar JSONObject
scalar ObjectID

type Query {
  ping: String!
}

type Mutation {
  ping: String!
}

type IntegerLinkOne {
  self: String
  related: String
  linkage: IntegerLinkage
}

type IntegerLinkMany {
  self: String
  related: String
  linkage: [IntegerLinkage!]!
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

type IntegerLinkage {
  id: Int!
  type: String!
}

type ObjectIDLinkage {
  id: ObjectID!
  type: String!
}

${websiteSection}

`;
