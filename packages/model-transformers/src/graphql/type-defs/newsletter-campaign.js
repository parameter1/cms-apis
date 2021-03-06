import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  newsletterCampaignById(input: QueryNewsletterCampaignByIdInput!): NewsletterCampaign
  newsletterCampaigns(input: PaginatedQueryInput = {}): QueryNewsletterCampaignsConnection!
}

type NewsletterCampaign implements UnderscoreFieldsInterface @interfaceFields {
  _id: ObjectID!
  _edge: NewsletterCampaign_Edge!
  date: NewsletterCampaignDate!
  externalId: String @trim
  html: String @trim
  isLocked: Boolean
  list: NewsletterCampaignList
  name: NewsletterCampaignName!
  subjectLine: String @trim
}

type NewsletterCampaign_Edge {
  newsletter: NewsletterCampaignNewsletterEdge!
}

type NewsletterCampaignDate {
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
