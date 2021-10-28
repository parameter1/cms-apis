import gql from '@cms-apis/graphql/tag';

export default gql`

type Query {
  ping: String!
  contentById(input: QueryContentByIdInput!): Content
}

type Content {
  _id: Int!
  _type: String!
}

input QueryContentByIdInput {
  id: Int!
}

`;
