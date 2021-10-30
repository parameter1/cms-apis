import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteSiteById(input: QueryWebsiteSiteByIdInput!): WebsiteSite
}

type WebsiteSite {
  _id: ObjectID!
  name: String! @trim
  fullName: String! @trim
  tagLine: String @trim
  description: String @trim
  logo: String @trim

  status: Int! @formatStatus

  url: String @trim

  title: String!
  shortName: String @trim
  hosts: WebsiteSiteHosts!
  origin: String!
  date: WebsiteSiteDate!
  language: WebsiteSiteLanguage!

  rootSectionConnection: WebsiteSiteRootSectionConnection!
}

type WebsiteSiteDate {
  timezone: String! # tz database format, e.g. America/Chicago
  format: String! # dayjs.format()
  locale: String! # dayjs.locale()
}

type WebsiteSiteHosts {
  root: String!
  image: String!
  asset: String!
}

type WebsiteSiteLanguage {
  code: String!
  primaryCode: String! # ISO 639-1
  subCode: String # https://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
}

type WebsiteSiteRootSectionConnection {
  edges: [WebsiteSiteRootSectionEdge!]!
}

type WebsiteSiteRootSectionEdge {
  node: WebsiteSection!
}

input QueryWebsiteSiteByIdInput {
  id: ObjectID!
}

`;
