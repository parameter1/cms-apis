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
  isPolymorphic: true
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
