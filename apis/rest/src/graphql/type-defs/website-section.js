import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteSectionById(input: QueryWebsiteSectionByIdInput!): WebsiteSection
  websiteSections(input: QueryWebsiteSectionsInput = {}): [WebsiteSection!]!
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
  children: IntegerLinkMany! @linkage(
    restType: "website/section"
    field: "descendants"
  )
  coverImage: ObjectIDLinkOne! @linkage(
    restType: "platform/asset/image"
  )
  logo: ObjectIDLinkOne! @linkage(
    restType: "platform/asset/image"
  )
  options: IntegerLinkMany! @linkage(
    restType: "website/option"
    empty: true
  )
  parent: IntegerLinkOne! @linkage(
    restType: "website/section"
  )
  relatedSections: IntegerLinkMany! @linkage(
    restType: "website/section"
    field: "related"
  )
  relatedTaxonomy: IntegerLinkMany! @linkage(
    restType: "platform/taxonomy"
    empty: true
  )
  site: ObjectIDLinkOne! @linkage(
    restType: "website/product/site"
    field: "website"
  )
}

input QueryWebsiteSectionByIdInput {
  id: Int!
}

input QueryWebsiteSectionsInput {
  ids: [Int!]! = []
  limit: Int = 50
}

`;
