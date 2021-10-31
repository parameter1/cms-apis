import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  contentInterfaceById(input: QueryContentInterfaceByIdInput!): ContentInterface
}

interface ContentInterface {
  _id: Int!
  _type: String! @trim(field: "type")
  name: ContentInterfaceName!
  teaser: ContentInterfaceTeaser!
  body: ContentInterfaceBody!

  status: Int! @formatStatus

  primaryWebsiteSectionEdge: ContentInterfacePrimaryWebsiteSectionEdge!
}

type ContentInterfaceName {
  default: String!
  email: String
  magazine: String
  website: String
}

type ContentInterfacePrimaryWebsiteSectionEdge {
  node: WebsiteSection!
}

type ContentInterfaceTeaser {
  default: String
  email: String
  magazine: String
  website: String
}

type ContentInterfaceBody {
  default: String
  email: String
  magazine: String
  website: String
}

input QueryContentInterfaceByIdInput {
  id: Int!
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

type ContentCompany implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentContact implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentDocument implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentEBook implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentEvent implements ContentInterface @interfaceFields {
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

type ContentSupplier implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentTextAd implements ContentInterface @interfaceFields {
  _id: Int!
}

type ContentVenue implements ContentInterface @interfaceFields {
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
