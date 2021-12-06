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
  subTypes: [
    "AWARD"
    "BADGE"
    "BIN"
    "CATEGORY"
    "INDUSTRY"
    "LOCATION"
    "MARKET"
    "ORGANIZATION"
    "PERSON"
    "PLATFORM_CHANNEL"
    "REGION"
    "SYSTEM"
    "TAG"
    "TOPIC"
    "TYPE"
  ]
) {
  id: Int!
  type: String!
  links: TaxonomyLinks!

  description: String @project @trim
  external: JSONObject # no longer used
  fullName: String @project(field: "name.full") @trim
  name: String @project(field: "name.default") @trim
}

type TaxonomyLinks {
  self: String!
}

`;
