import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  newsletterById(input: QueryNewsletterByIdInput!): Newsletter
  newsletters(input: PaginatedQueryInput = {}): QueryNewslettersConnection!
}

type Newsletter implements UnderscoreFieldsInterface @interfaceFields {
  _id: ObjectID!
  _connection: Newsletter_Connection!
  _edge: Newsletter_Edge!
  alias: String! @trim
  defaults: NewsletterDefaults!
  description: String @trim
  name: String! @trim
  provider: NewsletterProvider
  sourceProvider: NewsletterSourceProvider
  teaser: String @trim
  usesDeploymentDates: Boolean
}

type Newsletter_Connection {
  sections: [NewsletterSectionEdge!]!
}

type Newsletter_Edge {
  website: NewsletterWebsiteEdge!
}

type NewsletterDefaults {
  fromName: String
  subjectLine: String
  testers: [NewsletterDefaultTester!]!
}

type NewsletterDefaultTester {
  firstName: String @trim
  lastName: String @trim
  email: String @trim
}

type NewsletterProvider {
  type: String
  providerId: String
  attributes: JSONObject
}

type NewsletterSectionEdge {
  node: NewsletterSection!
}

type NewsletterSourceProvider {
  handlerKey: String
  host: String
  path: String
}

type NewsletterWebsiteEdge {
  node: Website!
}

type QueryNewslettersConnection {
  edges: [QueryNewslettersConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryNewslettersConnectionEdge {
  node: Newsletter!
  cursor: Cursor!
}

input QueryNewsletterByIdInput {
  id: Int!
}

`;
