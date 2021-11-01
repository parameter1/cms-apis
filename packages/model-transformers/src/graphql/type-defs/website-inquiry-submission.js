import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteInquirySubmissionById(input: QueryWebsiteInquirySubmissionByIdInput!): WebsiteInquirySubmission
  websiteInquirySubmissions(input: PaginatedQueryInput = {}): QueryWebsiteInquirySubmissionsConnection!
}

type WebsiteInquirySubmission {
  _id: ObjectID!
  payload: JSONObject

  addresses: WebsiteInquirySubmissionAddresses!

  dates: WebsiteInquirySubmissionDates!
  content: WebsiteInquirySubmissionContentInterfaceEdge!
}

type WebsiteInquirySubmissionAddresses {
  to: [String!]!
  cc: [String!]!
  bcc: [String!]!
  from: String! @trim
}

type WebsiteInquirySubmissionContentInterfaceEdge {
  node: ContentInterface!
}

type WebsiteInquirySubmissionDates {
  created: DateTime
}

type QueryWebsiteInquirySubmissionsConnection {
  edges: [QueryWebsiteInquirySubmissionsConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryWebsiteInquirySubmissionsConnectionEdge {
  node: WebsiteInquirySubmission!
  cursor: Cursor!
}

input QueryWebsiteInquirySubmissionByIdInput {
  id: Int!
}

`;