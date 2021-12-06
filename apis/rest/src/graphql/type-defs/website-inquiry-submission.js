import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  loadWebsiteInquirySubmissions(input: LoadManyQueryInput!): [WebsiteInquirySubmission!]!
    @query(kind: LOAD_MANY)
  websiteInquirySubmissionById(input: FindByIdQueryInput!): WebsiteInquirySubmission
    @query(kind: FIND_BY_ID)
  websiteInquirySubmissions(input: FindQueryInput = {}): [WebsiteInquirySubmission!]!
    @query(kind: FIND)
}

type WebsiteInquirySubmission @meta(
  restType: "website/inquiry-submission"
  repoName: "website-inquiry-submissions"
) {
  id: ObjectID!
  type: String!
  links: WebsiteInquirySubmissionLinks!

  addresses: JSONObject @project @object
  created: DateTime @project(field: "date.created")
  payload: JSONObject @project @object
}

type WebsiteInquirySubmissionLinks {
  self: String!
  contentId: LinkOne! @linkage(
    restType: "platform/content"
    field: "content"
  )
}

`;
