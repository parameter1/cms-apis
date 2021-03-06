import gql from '@cms-apis/graphql/tag';

import content from './content.js';
import imageAsset from './image-asset.js';
import taxonomy from './taxonomy.js';
import user from './user.js';
import website from './website.js';
import websiteInquirySubmission from './website-inquiry-submission.js';
import websiteRedirect from './website-redirect.js';
import websiteSchedule from './website-schedule.js';
import websiteScheduleOption from './website-schedule-option.js';
import websiteSection from './website-section.js';

export default gql`

directive @meta(
  restType: String!
  repoName: String!
) on OBJECT

directive @query(
  kind: RestQueryKindEnum!
) on FIELD_DEFINITION

directive @array(field: String) on FIELD_DEFINITION
directive @object(field: String) on FIELD_DEFINITION

directive @project(
  field: String
  needs: [String!]! = []
) on FIELD_DEFINITION

directive @linkage(
  restType: String!
  field: String
  empty: Boolean = false
) on FIELD_DEFINITION

directive @status on FIELD_DEFINITION
directive @trim(field: String, default: String) on FIELD_DEFINITION

scalar BaseID
scalar DateTime
scalar JSONObject
scalar ObjectID

enum RestQueryKindEnum {
  FIND
  FIND_BY_ID
  LOAD_MANY
}

enum SortOrderEnum {
  ASC
  DESC
}

type Query {
  ping: String!
}

type Mutation {
  ping: String!
}

type LinkOne {
  self: String
  related: String
  linkage: Linkage
}

type LinkMany {
  self: String
  related: String
  linkage: [Linkage!]!
}

type Linkage {
  id: BaseID!
  type: String!
}

input FindByIdQueryInput {
  id: BaseID!
  # polymorphic subtypes to filter by
  subTypes: [String!]! = []
}

input FindQueryInput {
  pagination: PaginationInput! = {}
  sort: [SortInput!]! = []
  # polymorphic subtypes to filter by
  subTypes: [String!]! = []
}

input LoadManyQueryInput {
  ids: [BaseID!]!
}

input PaginationInput {
  limit: Int = 50
  skip: Int = 0
}

input SortInput {
  field: String!
  order: SortOrderEnum!
}

${content}
${imageAsset}
${taxonomy}
${user}
${website}
${websiteInquirySubmission}
${websiteRedirect}
${websiteSchedule}
${websiteScheduleOption}
${websiteSection}

`;
