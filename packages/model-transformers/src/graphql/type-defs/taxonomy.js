import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  taxonomyById(input: QueryTaxonomyByIdInput!): Taxonomy
  taxonomies(input: PaginatedQueryInput = {}): QueryTaxonomiesConnection!
}

enum TaxonomyTypeEnum {
  AWARD
  BADGE
  BIN
  CATEGORY
  INDUSTRY
  LOCATION
  MARKET
  ORGANIZATION
  PERSON
  PLATFORM_CHANNEL
  REGION
  SYSTEM
  TAG
  TOPIC
  TYPE
}

type Taxonomy implements UnderscoreFieldsInterface @interfaceFields {
  _id: Int!
  _connection: Taxonomy_Connection!
  _edge: Taxonomy_Edge
  _type: TaxonomyTypeEnum! @trim(field: "type")
  depth: Int!
  description: String @trim
  isHierarchical: Boolean!
  name: TaxonomyName!
  path: String!
  sequence: Int!
  slug: String!
}

type Taxonomy_Connection {
  ancestors: [TaxonomyAncestorsEdge!]!
  descendants: [TaxonomyDescendantsEdge!]!
}

type Taxonomy_Edge {
  parent: TaxonomyParentEdge
}

type TaxonomyAncestorsEdge {
  depth: Int!
  node: Taxonomy!
}

type TaxonomyDescendantsEdge {
  depth: Int!
  node: Taxonomy!
}

type TaxonomyName {
  default: String!
  full: String!
  hierarchical: String!
}

type TaxonomyParentEdge {
  node: Taxonomy!
}

type QueryTaxonomiesConnection {
  edges: [QueryTaxonomiesConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryTaxonomiesConnectionEdge {
  node: Taxonomy!
  cursor: Cursor!
}

input QueryTaxonomyByIdInput {
  id: Int!
}

`;
