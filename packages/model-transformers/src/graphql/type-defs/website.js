import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteById(input: QueryWebsiteByIdInput!): Website
  websites(input: PaginatedQueryInput = {}): QueryWebsitesConnection!
}

type QueryWebsitesConnection {
  edges: [QueryWebsitesConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryWebsitesConnectionEdge {
  node: Website!
  cursor: Cursor!
}

type Website {
  _id: ObjectID!
  name: String! @trim
  tagLine: String @trim
  description: String @trim
  logo: String @trim

  status: Int! @formatStatus

  abbreviation: String @trim(field: "shortName")
  hosts: WebsiteHosts!
  origin: String!

  settings: WebsiteSettings!

  sectionOptions: [WebsiteSectionOptionEdge!]!
  sections: [WebsiteSectionEdge!]!
}

type WebsiteHosts {
  root: String!
  image: String!
  asset: String!
}

type WebsiteSectionEdge {
  node: WebsiteSection!
}

type WebsiteSectionOptionEdge {
  node: WebsiteSectionOption!
}

type WebsiteSettings {
  date: WebsiteSettingsDate!
  language: WebsiteSettingsLanguage!
}

type WebsiteSettingsDate {
  timezone: String! # tz database format, e.g. America/Chicago
  format: String! # dayjs.format()
  locale: String! # dayjs.locale()
}

type WebsiteSettingsLanguage {
  code: String!
  primaryCode: String! # ISO 639-1
  subCode: String # https://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
}

input QueryWebsiteByIdInput {
  id: ObjectID!
}

`;
