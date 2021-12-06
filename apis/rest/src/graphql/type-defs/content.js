import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  loadContent(input: LoadManyQueryInput!): [Content!]!
    @query(kind: LOAD_MANY)
  contentById(input: FindByIdQueryInput!): Content
    @query(kind: FIND_BY_ID)
  content(input: FindQueryInput = {}): [Content!]!
    @query(kind: FIND)
}

type Content @meta(
  restType: "platform/content"
  repoName: "content"
  subTypes: [
    "ARTICLE"
    "BLOG"
    "COMPANY"
    "CONTACT"
    "DOCUMENT"
    "EVENT"
    "MEDIA_GALLERY"
    "NEWS"
    "PAGE"
    "PODCAST"
    "PRESS_RELEASE"
    "PRODUCT"
    "PROMOTION"
    "SPACE"
    "SUPPLIER"
    "TOP_LIST"
    "TEXT_AD"
    "VENUE"
    "VIDEO"
    "WEBINAR"
    "WHITEPAPER"
  ]
) {
  id: Int!
  type: String!
  links: ContentLinks!

  name: String @project(field: "name.default") @trim
}

type ContentLinks {
  self: String!
}

`;
