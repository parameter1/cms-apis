import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  contentInterfaceById(input: QueryContentInterfaceByIdInput!): ContentInterface
}

interface ContentInterface {
  _id: Int!
  _type: String!
}

type ContentArticle implements ContentInterface @interfaceFields {
  _id: Int!
}

input QueryContentInterfaceByIdInput {
  id: Int!
}

`;
