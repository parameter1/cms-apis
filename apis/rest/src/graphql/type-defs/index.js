import gql from '@cms-apis/graphql/tag';

export default gql`

scalar ObjectID

type Query {
  ping: String!
}

type Mutation {
  ping: String!
}

`;
