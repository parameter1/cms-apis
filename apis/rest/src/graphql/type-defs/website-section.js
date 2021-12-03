import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  loadWebsiteSections(input: LoadManyQueryInput!): [WebsiteSection!]!
    @query(kind: LOAD_MANY)
  websiteSectionById(input: FindByIdQueryInput!): WebsiteSection
    @query(kind: FIND_BY_ID)
  websiteSections(input: FindQueryInput = {}): [WebsiteSection!]!
    @query(kind: FIND)
}

type WebsiteSection @meta(
  restType: "website/section"
  repoName: "website-sections"
) {
  id: Int!
  type: String!
  links: WebsiteSectionLinks!

  accessControl: [String!]! @array # no longer used
  alias: String @project @trim
  descendantIds: [Int!]! @project(field: "_connection.descendants.node._id")
  description: String @project @trim
  fullName: String @project(field: "name.full") @trim
  labels: [String!]! @project @array
  legacy: JSONObject # no longer used
  name: String @project(field: "name.default") @trim
  redirects: [String!]! @project @array
  seoDescription: String @project(field: "seo.description") @trim
  seoTitle: String @project(field: "seo.title") @trim
  sequence: Int @project
  slug: String @project @trim
  status: Int @project
}

type WebsiteSectionLinks {
  self: String!
  children: LinkMany! @linkage(
    restType: "website/section"
    field: "descendants"
  )
  coverImage: LinkOne! @linkage(
    restType: "platform/asset/image"
  )
  logo: LinkOne! @linkage(
    restType: "platform/asset/image"
  )
  options: LinkMany! @linkage(
    restType: "website/option"
    empty: true
  )
  parent: LinkOne! @linkage(
    restType: "website/section"
  )
  relatedSections: LinkMany! @linkage(
    restType: "website/section"
    field: "related"
  )
  # no longer used
  relatedTaxonomy: LinkMany! @linkage(
    restType: "platform/taxonomy"
    empty: true
  )
  site: LinkOne! @linkage(
    restType: "website/product/site"
    field: "website"
  )
}

`;
