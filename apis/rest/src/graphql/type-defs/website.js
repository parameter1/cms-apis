import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  loadWebsites(input: LoadManyQueryInput!): [Website!]!
    @query(kind: LOAD_MANY)
  websiteById(input: FindByIdQueryInput!): Website
    @query(kind: FIND_BY_ID)
  websites(input: FindQueryInput = {}): [Website!]!
    @query(kind: FIND)
}

type Website @meta(
  restType: "website/product/site"
  repoName: "websites"
) {
  id: ObjectID!
  type: String!
  links: WebsiteLinks!

  assetHost: String @project(field: "host.asset") @trim
  description: String @project @trim
  fullName: String @project(field: "name") @trim # no longer used
  host: String @project(field: "host.root") @trim
  imageHost: String @project(field: "host.image") @trim
  legacy: JSONObject # no longer used
  logo: String @trim # no longer used
  name: String @project @trim
  redirects: JSONObject! @object # no longer used
  sequence: Int @project # no longer used
  socialFollow: [String!]! @array # no longer used
  status: Int @project
  tagLine: String @trim # no longer used
  url: String @project(field: "host.root") @trim # no longer used
}

type WebsiteLinks {
  self: String!
  options: LinkMany! @linkage(
    restType: "website/option"
    field: "scheduleOptions"
  )
  # no longer used
  organization: LinkOne! @linkage(
    restType: "platform/entity/organization"
    empty: true
  )
  # no longer used
  pages: LinkMany! @linkage(
    restType: "website/page"
    empty: true
  )
  sections: LinkMany! @linkage(
    restType: "website/section"
  )
}

`;
