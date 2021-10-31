import gql from '@cms-apis/graphql/tag';

import content from './content.js';
import emailNewsletters from './email-newsletters.js';
import imageAsset from './image-asset.js';
import website from './website.js';
import websiteRedirect from './website-redirect.js';
import websiteSection from './website-section.js';
import websiteSectionOption from './website-section-option.js';

export default gql`

directive @formatStatus(field: String) on FIELD_DEFINITION
directive @interfaceFields on OBJECT
directive @trim(field: String, default: String) on FIELD_DEFINITION

scalar Cursor
scalar EJSONObject
scalar ObjectID

type Query {
  ping: String!
}

type PageInfo {
  totalCount: Int!
  hasNextPage: Boolean!
  endCursor: Cursor
}

input PaginatedQueryInput {
  query: EJSONObject
  after: Cursor
  limit: Int! = 250
}

${content}
${emailNewsletters}
${imageAsset}
${website}
${websiteRedirect}
${websiteSection}
${websiteSectionOption}

`;
