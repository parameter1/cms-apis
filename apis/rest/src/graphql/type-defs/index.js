import gql from '@cms-apis/graphql/tag';

import website from './website.js';
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

directive @trim(field: String, default: String) on FIELD_DEFINITION

scalar BaseID
scalar JSONObject
scalar ObjectID

enum RestQueryKindEnum {
  FIND
  FIND_BY_ID
  LOAD_MANY
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
}

input FindQueryInput {
  ids: [BaseID!]! = []
}

input LoadManyQueryInput {
  ids: [BaseID!]!
}

${website}
${websiteScheduleOption}
${websiteSection}

`;
