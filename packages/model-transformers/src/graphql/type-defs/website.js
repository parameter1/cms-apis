import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteById(input: QueryWebsiteByIdInput!): Website
}

type Website {
  _id: ObjectID!
  name: String!
  fullName: String!
  tagLine: String
  description: String
  logo: String

  status: Int!

  url: String

  title: String!
  shortName: String
  hosts: WebsiteHosts!
  origin: String!
}

type WebsiteHosts {
  root: String!
  image: String!
  asset: String!
}

input QueryWebsiteByIdInput {
  id: ObjectID!
}

`;
