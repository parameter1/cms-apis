import gql from '@cms-apis/graphql/tag';

import websiteSection from './website-section.js';

export default gql`

directive @array(field: String) on FIELD_DEFINITION
directive @trim(field: String, default: String) on FIELD_DEFINITION

scalar JSONObject
scalar ObjectID

type Query {
  ping: String!
}

type Mutation {
  ping: String!
}

type ObjectIDLinkage {
  id: ObjectID!
  type: String!
}

type IntegerLinkage {
  id: Int!
  type: String!
}

${websiteSection}

`;
