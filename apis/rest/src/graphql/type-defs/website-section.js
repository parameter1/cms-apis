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
