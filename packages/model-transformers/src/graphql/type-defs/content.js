import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  contentInterfaceById(input: QueryContentInterfaceByIdInput!): ContentInterface
  contentInterfaces(input: PaginatedQueryInput = {}): QueryContentInterfacesConnection!
}

interface ContentInterface {
  _id: Int!
  _type: String! @trim(field: "type")
  name: ContentInterfaceName!
  teaser: ContentInterfaceTeaser!
  body: ContentInterfaceBody!

  shortName: String @trim
  fullName: String! @trim
  hash: String @trim

  deck: String @trim

  status: Int! @formatStatus

  notes: String @trim

  dates: ContentInterfaceDates!

  seoTitle: String! @trim(field: "mutations.Website.seoTitle")
  seoDescription: String @trim(field: "mutations.Website.seoDescription")
  alias: String @trim(field: "mutations.Website.alias")
  slug: String @trim(field: "mutations.Website.slug")
  redirects: [String!]!


  createdBy: ContentInterfaceCreatedByEdge
  updatedBy: ContentInterfaceUpdatedByEdge
  company: ContentInterfaceCompanyEdge
  primaryImage: ContentInterfacePrimaryImageEdge
  primaryWebsiteSection: ContentInterfacePrimaryWebsiteSectionEdge!
  images: [ContentInterfaceImagesEdge!]!
  relatedTo: [ContentInterfaceRelatedToEdge!]!
}

# company, contact, event, supplier, top-100, venue
interface ContentAddressableInterface {
  address1: String @trim
  address2: String @trim
  city: String @trim
  region: String @trim(field: "state")
  postalCode: String @trim(field: "zip")
  country: String @trim
  location: ContentAddressableInterfaceLocation!
  cityRegionPostalCode: String
}

type ContentAddressableInterfaceLocation {
  latitude: Float
  longitude: Float
}


type ContentInterfaceBody {
  default: String
  newsletter: String
  magazine: String
  website: String
}

type ContentInterfaceCompanyEdge {
  node: ContentCompany!
}

type ContentInterfaceCreatedByEdge {
  node: User!
}

type ContentInterfaceDates {
  expired: DateTime
  published: DateTime
  created: DateTime
  updated: DateTime
  touched: DateTime
}

type ContentInterfaceImagesEdge {
  node: ImageAsset!
}

type ContentInterfaceName {
  default: String!
  newsletter: String
  magazine: String
  website: String
}

type ContentInterfacePrimaryImageEdge {
  node: ImageAsset!
}

type ContentInterfacePrimaryWebsiteSectionEdge {
  node: WebsiteSection!
}

type ContentInterfaceRelatedToEdge {
  node: ContentInterface!
}

type ContentInterfaceTeaser {
  default: String
  newsletter: String
  magazine: String
  website: String
}

type ContentInterfaceUpdatedByEdge {
  node: User!
}

input QueryContentInterfaceByIdInput {
  id: Int!
}

type QueryContentInterfacesConnection {
  edges: [QueryContentInterfacesConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryContentInterfacesConnectionEdge {
  node: ContentInterface!
  cursor: Cursor!
}




# CONTENT TYPES
type ContentArticle implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentBlog implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentCollection implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentCompany implements ContentInterface & ContentAddressableInterface @interfaceFields {
  _id: Int!
}

type ContentContact implements ContentInterface & ContentAddressableInterface @interfaceFields {
  _id: Int!
}

type ContentDocument implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentEBook implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentEvent implements ContentInterface & ContentAddressableInterface @interfaceFields {
  _id: Int!
}

type ContentJob implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentMediaGallery implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentNews implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentPage implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentPodcast implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentPressRelease implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentProduct implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentPromotion implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentSpace implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentSupplier implements ContentInterface & ContentAddressableInterface @interfaceFields {
  _id: Int!
}

type ContentTextAd implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentVenue implements ContentInterface & ContentAddressableInterface @interfaceFields {
  _id: Int!
}

type ContentVideo implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentWebinar implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentWhitepaper implements ContentInterface @interfaceFields {
  _id: Int!
}

`;
