import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  newsletterScheduleById(input: QueryNewsletterScheduleByIdInput!): NewsletterSchedule
  newsletterSchedules(input: PaginatedQueryInput = {}): QueryNewsletterSchedulesConnection!
}

type NewsletterSchedule implements UnderscoreFieldsInterface @interfaceFields {
  _id: ObjectID!
  _edge: NewsletterSchedule_Edge!
  date: NewsletterScheduleDate!
  sequence: Int!
}

type NewsletterSchedule_Edge {
  content: NewsletterScheduleContentEdge!
  section: NewsletterScheduleSectionEdge!
}

type NewsletterScheduleContentEdge {
  node: Content!
}

type NewsletterScheduleDate {
  deployed: DateTime!
}

type NewsletterScheduleSectionEdge {
  node: NewsletterSection!
}

type QueryNewsletterSchedulesConnection {
  edges: [QueryNewsletterSchedulesConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryNewsletterSchedulesConnectionEdge {
  node: NewsletterSchedule!
  cursor: Cursor!
}

input QueryNewsletterScheduleByIdInput {
  id: Int!
}

`;
