import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  newsletterScheduleById(input: QueryNewsletterScheduleByIdInput!): NewsletterSchedule
  newsletterSchedules(input: PaginatedQueryInput = {}): QueryNewsletterSchedulesConnection!
}

type NewsletterSchedule {
  _id: ObjectID!

  deploymentDate: DateTime!
  status: Int! @formatStatus

  sequence: Int!

  content: NewsletterScheduleContentEdge!
  section: NewsletterScheduleSectionEdge!
}

type NewsletterScheduleContentEdge {
  node: Content!
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
