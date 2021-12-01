import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteSectionById(input: QueryWebsiteSectionByIdInput!): WebsiteSection
}

type WebsiteSection {
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
  children: WebsiteSectionLinksChildren!
  coverImage: WebsiteSectionLinksCoverImage!
  logo: WebsiteSectionLinksLogo!
  options: WebsiteSectionLinksOptions!
  parent: WebsiteSectionLinksParent!
  relatedSections: WebsiteSectionLinksRelatedSections!
  relatedTaxonomy: WebsiteSectionLinksRelatedTaxonomy!
  site: WebsiteSectionLinksSite!
}

type WebsiteSectionLinksChildren {
  linkage: [IntegerLinkage!]!
}

type WebsiteSectionLinksCoverImage {
  linkage: ObjectIDLinkage
}

type WebsiteSectionLinksLogo {
  linkage: ObjectIDLinkage
}

type WebsiteSectionLinksOptions {
  linkage: [IntegerLinkage!]!
}

type WebsiteSectionLinksParent {
  linkage: IntegerLinkage
}

type WebsiteSectionLinksRelatedSections {
  linkage: [IntegerLinkage!]!
}

type WebsiteSectionLinksRelatedTaxonomy {
  linkage: [IntegerLinkage!]!
}

type WebsiteSectionLinksSite {
  linkage: ObjectIDLinkage
}

input QueryWebsiteSectionByIdInput {
  id: Int!
}

`;
