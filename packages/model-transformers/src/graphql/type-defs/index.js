import gql from '@cms-apis/graphql/tag';

import content from './content.js';
import imageAsset from './image-asset.js';
import magazine from './magazine.js';
import magazineIssue from './magazine-issue.js';
import magazineSchedule from './magazine-schedule.js';
import magazineSection from './magazine-section.js';
import newsletter from './newsletter.js';
import newsletterCampaign from './newsletter-campaign.js';
import newsletterSchedule from './newsletter-schedule.js';
import newsletterSection from './newsletter-section.js';
import taxonomy from './taxonomy.js';
import user from './user.js';
import website from './website.js';
import websiteInquirySubmission from './website-inquiry-submission.js';
import websiteRedirect from './website-redirect.js';
import websiteSchedule from './website-schedule.js';
import websiteScheduleOption from './website-schedule-option.js';
import websiteSection from './website-section.js';

export default gql`

directive @formatDeleted on FIELD_DEFINITION
directive @formatStatus(field: String) on FIELD_DEFINITION
directive @interfaceFields on OBJECT
directive @trim(field: String, default: String) on FIELD_DEFINITION

scalar Cursor
scalar DateTime
scalar EJSONObject
scalar JSONObject
scalar ObjectID

interface UnderscoreFieldsInterface {
  _meta: Meta!
  _sync: SyncInfo!
  _version: Version!
}

type Query {
  ping: String!
}

type PageInfo {
  totalCount: Int!
  hasNextPage: Boolean!
  endCursor: Cursor
}

type SyncInfo {
  date: DateTime!
}

type Version {
  n: Int!
  history: [VersionHistory!]!
}

type VersionHistory {
  date: DateTime!
  by: User
}

type Meta {
  created: MetaDate!
  updated: MetaDate!
}

type MetaDate {
  date: DateTime!
  by: User
}

input PaginatedQueryInput {
  query: EJSONObject
  after: Cursor
  limit: Int! = 250
}

${content}
${imageAsset}
${magazine}
${magazineIssue}
${magazineSchedule}
${magazineSection}
${newsletter}
${newsletterCampaign}
${newsletterSchedule}
${newsletterSection}
${taxonomy}
${user}
${website}
${websiteInquirySubmission}
${websiteRedirect}
${websiteSchedule}
${websiteScheduleOption}
${websiteSection}

`;
