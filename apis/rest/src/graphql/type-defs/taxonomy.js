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
) {
  id: Int!
  type: String!
  links: TaxonomyLinks!

  description: String @project @trim
  external: JSONObject # no longer used
  fullName: String! @project(field: "name.full") @trim
  hierarchyIndex: Int! @project(field: "depth")
  name: String! @project(field: "name.default") @trim
  redirects: [String!]! @array # no longer used
  sequence: Int! @project
  status: Int! @status # no longer used
  urlNameWebsite: String! @project(field: "slug")
  urlPathWebsite: String! @project(field: "path")
}

type TaxonomyLinks {
  self: String!
  children: LinkMany! @linkage(
    restType: "platform/taxonomy"
    field: "descendants"
  )
  image: LinkOne! @linkage(
    restType: "platform/asset/image"
    empty: true
  )
  parent: LinkOne! @linkage(
    restType: "platform/taxonomy"
  )
}

`;
