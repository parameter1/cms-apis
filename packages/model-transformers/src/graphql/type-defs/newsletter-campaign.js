import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  newsletterCampaignById(input: QueryNewsletterCampaignByIdInput!): NewsletterCampaign
  newsletterCampaigns(input: PaginatedQueryInput = {}): QueryNewsletterCampaignsConnection!
}

type NewsletterCampaign {
  _id: ObjectID!
  name: String! @trim
  status: Int! @formatStatus

  externalId: String @trim
  fromName: String @trim
  html: String @trim
  locked: Boolean
  subjectLine: String @trim

  dates: NewsletterCampaignDates!
  list: NewsletterCampaignList!

  createdBy: NewsletterCampaignCreatedByEdge
  newsletter: NewsletterCampaignNewsletterEdge!
}

type NewsletterCampaignCreatedByEdge {
  node: User!
}

type NewsletterCampaignDates {
  created: DateTime
  touched: DateTime
  updated: DateTime
  deployment: DateTime
  scheduled: DateTime
  html: DateTime
}

type NewsletterCampaignList {
  identifier: String @trim
  message: String @trim
  status: String @trim
}

type NewsletterCampaignNewsletterEdge {
  node: Newsletter!
}

type QueryNewsletterCampaignsConnection {
  edges: [QueryNewsletterCampaignsConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryNewsletterCampaignsConnectionEdge {
  node: NewsletterCampaign!
  cursor: Cursor!
}

input QueryNewsletterCampaignByIdInput {
  id: Int!
}

`;
