import gql from '@cms-apis/graphql/tag';

export default gql`

directive @trim(field: String, default: String) on FIELD_DEFINITION

scalar ObjectID

type Query {
  ping: String!
}

type Mutation {
  ping: String!
}

`;
