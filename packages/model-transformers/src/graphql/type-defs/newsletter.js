import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  newsletterById(input: QueryNewsletterByIdInput!): Newsletter
  newsletters(input: PaginatedQueryInput = {}): QueryNewslettersConnection!
}

type Newsletter {
  _id: ObjectID!
  name: String! @trim
  teaser: String @trim
  alias: String! @trim
  tagLine: String @trim
  description: String @trim
  logo: String @trim

  status: Int! @formatStatus

  website: NewsletterWebsiteEdge!

  sections: [NewsletterSectionEdge!]!

  defaults: NewsletterDefaults!
  usesDeploymentDates: Boolean

  provider: NewsletterProvider
  sourceProvider: NewsletterSourceProvider
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
  type: String @trim
  providerId: String @trim
  attributes: JSONObject
}

type NewsletterSectionEdge {
  node: NewsletterSection!
}

type NewsletterSourceProvider {
  handlerKey: String @trim
  host: String @trim
  path: String @trim
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
