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
  _connection: Website_Connection!
  _sync: SyncInfo!
  abbreviation: String @trim(field: "shortName")
  description: String @trim
  host: WebsiteHost!
  name: String! @trim
  origin: String!
  settings: WebsiteSettings!
}

type Website_Connection {
  scheduleOptions: [WebsiteScheduleOptionsEdge!]!
  sections: [WebsiteSectionsEdge!]!
}

type WebsiteHost {
  root: String!
  image: String!
  asset: String!
}

type WebsiteSectionsEdge {
  node: WebsiteSection!
}

type WebsiteScheduleOptionsEdge {
  node: WebsiteScheduleOption!
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
