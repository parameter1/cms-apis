import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteSectionById(input: QueryWebsiteSectionByIdInput!): WebsiteSection
}

type WebsiteSection {
  id: Int!
  type: String!

  accessControl: [String!]! @array
  alias: String @trim
  canonicalUrl: String @trim(field: "seo.canonicalUrl")
  descendantIds: [Int!]!
  description: String @trim
  fullName: String @trim(field: "name.full")
  labels: [String!]! @array
  legacy: JSONObject
  links: WebsiteSectionLinks!
  name: String @trim(field: "name.default")
  redirects: [String!]! @array
  seoDescription: String @trim(field: "seo.description")
  seoTitle: String @trim(field: "seo.title")
  sequence: Int
  slug: String @trim
  status: Int
}

type WebsiteSectionLinks {
  self: String!
}

input QueryWebsiteSectionByIdInput {
  id: Int!
}

`;
