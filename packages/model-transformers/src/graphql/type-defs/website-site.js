import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteSiteById(input: QueryWebsiteSiteByIdInput!): WebsiteSite
  websiteSites(input: PaginatedQueryInput = {}): QueryWebsiteSitesConnection!
}

type QueryWebsiteSitesConnection {
  edges: [QueryWebsiteSitesConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryWebsiteSitesConnectionEdge {
  node: WebsiteSite!
  cursor: Cursor!
}

type WebsiteSite {
  _id: ObjectID!
  name: String! @trim
  tagLine: String @trim
  description: String @trim
  logo: String @trim

  status: Int! @formatStatus

  abbreviation: String @trim(field: "shortName")
  hosts: WebsiteSiteHosts!
  origin: String!

  settings: WebsiteSiteSettings!

  options: [WebsiteSiteOptionEdge!]!
  sections: [WebsiteSiteSectionEdge!]!
}

type WebsiteSiteHosts {
  root: String!
  image: String!
  asset: String!
}

type WebsiteSiteSectionEdge {
  node: WebsiteSection!
}

type WebsiteSiteOptionEdge {
  node: WebsiteOption!
}

type WebsiteSiteSettings {
  date: WebsiteSiteSettingsDate!
  language: WebsiteSiteSettingsLanguage!
}

type WebsiteSiteSettingsDate {
  timezone: String! # tz database format, e.g. America/Chicago
  format: String! # dayjs.format()
  locale: String! # dayjs.locale()
}

type WebsiteSiteSettingsLanguage {
  code: String!
  primaryCode: String! # ISO 639-1
  subCode: String # https://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
}

input QueryWebsiteSiteByIdInput {
  id: ObjectID!
}

`;
