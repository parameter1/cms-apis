import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  websiteInquirySubmissionById(input: QueryWebsiteInquirySubmissionByIdInput!): WebsiteInquirySubmission
  websiteInquirySubmissions(input: PaginatedQueryInput = {}): QueryWebsiteInquirySubmissionsConnection!
}

type WebsiteInquirySubmission implements UnderscoreFieldsInterface @interfaceFields {
  _id: ObjectID!
  _edge: WebsiteInquirySubmission_Edge!
  addresses: WebsiteInquirySubmissionAddresses!
  date: WebsiteInquirySubmissionDate!
  payload: JSONObject
}

type WebsiteInquirySubmission_Edge {
  content: WebsiteInquirySubmissionContentEdge!
}

type WebsiteInquirySubmissionAddresses {
  to: [String!]!
  cc: [String!]!
  bcc: [String!]!
  from: String! @trim
}

type WebsiteInquirySubmissionContentEdge {
  node: Content!
}

type WebsiteInquirySubmissionDate {
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
