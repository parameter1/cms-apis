import gql from '@cms-apis/graphql/tag';

import websiteSection from './website-section.js';

export default gql`

directive @trim(field: String, default: String) on FIELD_DEFINITION

scalar ObjectID

type Query {
  ping: String!
}

type Mutation {
  ping: String!
}

${websiteSection}

`;
