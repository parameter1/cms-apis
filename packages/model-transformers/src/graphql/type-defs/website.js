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
  date: WebsiteDate!
  language: WebsiteLanguage!

  rootSectionConnection: WebsiteRootSectionConnection!
}

type WebsiteDate {
  timezone: String! # tz database format, e.g. America/Chicago
  format: String! # dayjs.format()
  locale: String! # dayjs.locale()
}

type WebsiteHosts {
  root: String!
  image: String!
  asset: String!
}

type WebsiteLanguage {
  code: String!
  primaryCode: String! # ISO 639-1
  subCode: String # https://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
}

type WebsiteRootSectionConnection {
  edges: [WebsiteRootSectionEdge!]!
}

type WebsiteRootSectionEdge {
  node: WebsiteSection!
}

input QueryWebsiteByIdInput {
  id: ObjectID!
}

`;
