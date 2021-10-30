import gql from '@cms-apis/graphql/tag';

import content from './content.js';
import websiteOption from './website-option.js';
import websiteSection from './website-section.js';
import websiteSite from './website-site.js';

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
${websiteOption}
${websiteSection}
${websiteSite}

`;
