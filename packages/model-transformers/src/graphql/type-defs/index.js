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

${content}
${website}
${websiteSection}
${websiteSectionOption}

`;
