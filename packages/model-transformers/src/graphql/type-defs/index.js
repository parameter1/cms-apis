import gql from '@cms-apis/graphql/tag';

import content from './content.js';
import website from './website.js';
import websiteSection from './website-section.js';
import websiteSectionOption from './website-section-option.js';

export default gql`

directive @interfaceFields on OBJECT

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
${website}
${websiteSection}
${websiteSectionOption}

`;
