import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  loadTaxonomies(input: LoadManyQueryInput!): [Taxonomy!]!
    @query(kind: LOAD_MANY)
  taxonomyById(input: FindByIdQueryInput!): Taxonomy
    @query(kind: FIND_BY_ID)
  taxonomies(input: FindQueryInput = {}): [Taxonomy!]!
    @query(kind: FIND)
}

type Taxonomy @meta(
  restType: "platform/taxonomy"
  repoName: "taxonomies"
  isPolymorphic: true
) {
  id: Int!
  type: String!
  links: TaxonomyLinks!

  name: String @project(field: "name.default") @trim
}

type TaxonomyLinks {
  self: String!
}

`;
