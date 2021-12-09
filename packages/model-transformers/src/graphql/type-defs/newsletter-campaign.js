import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  newsletterCampaignById(input: QueryNewsletterCampaignByIdInput!): NewsletterCampaign
  newsletterCampaigns(input: PaginatedQueryInput = {}): QueryNewsletterCampaignsConnection!
}

type NewsletterCampaign {
  _id: ObjectID!
  _edge: NewsletterCampaign_Edge!
  _sync: SyncInfo!
  date: NewsletterCampaignDate!
  externalId: String @trim
  html: String @trim
  isLocked: Boolean
  list: NewsletterCampaignList
  name: NewsletterCampaignName!
  subjectLine: String @trim
}

type NewsletterCampaign_Edge {
  createdBy: NewsletterCampaignCreatedByEdge
  newsletter: NewsletterCampaignNewsletterEdge!
}

type NewsletterCampaignCreatedByEdge {
  node: User!
}

type NewsletterCampaignDate {
  created: DateTime
  touched: DateTime
  updated: DateTime
  deployed: DateTime
  scheduled: DateTime
  htmlUpdated: DateTime
}

type NewsletterCampaignList {
  identifier: String
  message: String
  status: String
}

type NewsletterCampaignName {
  default: String!
  from: String
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
