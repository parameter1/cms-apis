import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  contentById(input: QueryContentByIdInput!): Content
  allContent(input: PaginatedQueryInput = {}): QueryAllContentConnection!
}

enum ContentTypeEnum {
  ARTICLE
  BLOG
  COMPANY
  CONTACT
  DOCUMENT
  EVENT
  JOB
  MEDIA_GALLERY
  NEWS
  PAGE
  PODCAST
  PRESS_RELEASE
  PRODUCT
  PROMOTION
  SPACE
  SUPPLIER
  TEXT_AD
  VENUE
  VIDEO
  WEBINAR
  WHITEPAPER
}

enum ContentContactTypeEnum {
  AUTHOR
  CONTRIBUTOR
  PHOTOGRAPHER
  LISTING
  PUBLIC
  SALES
  MARKETING
  EDITOR # from whitepaper
  MEDIA # where type in document, infographic, podcast, video, webinar, whitepaper and contacts field exists
  OTHER
}

enum ContentLinkSocialProviderEnum {
  FACEBOOK
  INSTAGRAM
  LINKEDIN
  PINTEREST
  TIKTOK
  TWITTER
  YOUTUBE
  OTHER
}

type Content {
  _id: Int!
  _type: ContentTypeEnum! @trim(field: "type")
  titles: ContentTitles
  teasers: ContentTeasers
  bodies: ContentBodies
  hash: String @trim
  notes: String @trim

  status: Int! @formatStatus

  dates: ContentDates

  alias: String
  slug: String @trim(field: "mutations.Website.slug")
  redirects: [String!]!

  createdBy: ContentCreatedByEdge
  updatedBy: ContentUpdatedByEdge
  company: ContentCompanyEdge
  primaryImage: ContentPrimaryImageEdge
  primaryWebsiteSection: ContentPrimaryWebsiteSectionEdge!
  images: [ContentImagesEdge!]!
  relatedTo: [ContentRelatedToEdge!]!

  labels: [String!]!

  sidebars: [ContentSidebar!]!

  # was the Addressable interface: applied to company, contact, event, supplier, top-100, venue
  address: ContentAddress
  # was the Contactable interface: applied to company, contact, event, supplier, venue
  contactInfo: ContentContactInfo
  # combines Authorable, OrganizationContactable, Media.contacts and ContentWhitepaper.editors
  contacts: [ContentContactsEdge!]!
  # combines SocialLinkable, Contactable.website, Content.externalLinks, Company.[xxx]Url fields
  links: ContentLinks!

  seo: ContentSEO
}

type ContentAddress {
  street: String
  streetExtra: String
  city: String @trim
  region: String @trim(field: "state")
  postalCode: String @trim(field: "zip")
  country: String @trim
  location: ContentAddressLocation
  cityRegionPostalCode: String
}

type ContentAddressLocation {
  type: String!
  coordinates: [Float!]!
}

type ContentBodies {
  default: String
  newsletter: String
  magazine: String
  website: String
  original: String
}

type ContentCompanyEdge {
  node: Content!
}

type ContentContactInfo {
  phones: ContentContactInfoPhones
  emails: ContentContactInfoEmails
  person: ContentContactInfoPerson
}

type ContentContactInfoEmails {
  default: String
  public: String
}

type ContentContactInfoPerson {
  name: String
  firstName: String
  lastName: String
  title: String
}

type ContentContactInfoPhones {
  default: String
  tollfree: String
  fax: String
  mobile: String
}

type ContentContactsEdge {
  type: ContentContactTypeEnum!
  node: Content!
}

type ContentCreatedByEdge {
  node: User!
}

type ContentDates {
  expired: DateTime
  published: DateTime
  created: DateTime
  updated: DateTime
  touched: DateTime
}

type ContentImagesEdge {
  node: ImageAsset!
}

type ContentLinks {
  external: [ContentLinkExternal!]!
  social: [ContentLinkSocial!]!
  website: String
}

type ContentLinkExternal {
  key: String
  url: String!
  label: String
}

type ContentLinkSocial {
  provider: ContentLinkSocialProviderEnum!
  url: String!
  label: String
}

type ContentPrimaryImageEdge {
  node: ImageAsset!
}

type ContentPrimaryWebsiteSectionEdge {
  node: WebsiteSection!
}

type ContentRelatedToEdge {
  node: Content!
}

type ContentSEO {
  title: String!
  description: String
}

type ContentSidebar {
  body: String! @trim(default: "")
  name: String @trim
  label: String @trim
  sequence: Int!
}

type ContentTeasers {
  default: String
  newsletter: String
  magazine: String
  website: String
  deck: String
}

type ContentTitles {
  default: String
  newsletter: String
  magazine: String
  website: String
  short: String
  full: String
  headline: String
}

type ContentUpdatedByEdge {
  node: User!
}

input QueryContentByIdInput {
  id: Int!
}

type QueryAllContentConnection {
  edges: [QueryAllContentConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryAllContentConnectionEdge {
  node: Content!
  cursor: Cursor!
}

`;
