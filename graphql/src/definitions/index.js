import { gql } from 'apollo-server-fastify';

export default gql`

directive @connectionProject(type: String!) on OBJECT
directive @interfaceFields on OBJECT
directive @project(field: String, needs: [String!]! = []) on FIELD_DEFINITION

type Query {
  "A simple ping/pong query."
  ping: String!
}

type Mutation {
  "A simple ping/pong mutation."
  ping: String!
}

`;
