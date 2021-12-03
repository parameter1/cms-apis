import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  loadWebsiteScheduleOptions(input: LoadManyQueryInput!): [WebsiteScheduleOption!]!
    @query(kind: LOAD_MANY)
  websiteScheduleOptionById(input: FindByIdQueryInput!): WebsiteScheduleOption
    @query(kind: FIND_BY_ID)
  websiteScheduleOptions(input: FindQueryInput = {}): [WebsiteScheduleOption!]!
    @query(kind: FIND)
}

type WebsiteScheduleOption @meta(
  restType: "website/option"
  repoName: "website-schedule-options"
) {
  id: Int!
  type: String!
  links: WebsiteScheduleOptionLinks!

  description: String @project @trim
  legacy: JSONObject # no longer used
  name: String @project(field: "name.default") @trim
  status: Int @project
}

type WebsiteScheduleOptionLinks {
  self: String!
  section: LinkOne! @linkage(
    restType: "website/section"
    empty: true
  )
  site: LinkOne! @linkage(
    restType: "website/product/site"
    field: "website"
  )
}

`;
