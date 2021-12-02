import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteSectionById(input: QueryWebsiteSectionByIdInput!): WebsiteSection
  websiteSections(input: QueryWebsiteSectionsInput = {}): [WebsiteSection!]!
}

type WebsiteSection @modelMeta(type: "website/section") {
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
    type: "website/section"
    field: "descendants"
  )
  coverImage: ObjectIDLinkOne! @linkage(
    type: "platform/asset/image"
  )
  logo: ObjectIDLinkOne! @linkage(
    type: "platform/asset/image"
  )
  options: IntegerLinkMany! @linkage(
    type: "website/option"
    empty: true
  )
  parent: IntegerLinkOne! @linkage(
    type: "website/section"
  )
  relatedSections: IntegerLinkMany! @linkage(
    type: "website/section"
    field: "related"
  )
  relatedTaxonomy: IntegerLinkMany! @linkage(
    type: "platform/taxonomy"
    empty: true
  )
  site: ObjectIDLinkOne! @linkage(
    type: "website/product/site"
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
