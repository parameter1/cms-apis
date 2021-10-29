import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteSectionOptionById(input: QueryWebsiteSectionOptionByIdInput!): WebsiteSectionOption
}

type WebsiteSectionOption {
  _id: Int!
  name: String!
  description: String
  status: Int!
  websiteEdge: WebsiteSectionOptionWebsiteEdge!
}

type WebsiteSectionOptionWebsiteEdge {
  node: Website!
}

input QueryWebsiteSectionOptionByIdInput {
  id: Int!
}

`;
