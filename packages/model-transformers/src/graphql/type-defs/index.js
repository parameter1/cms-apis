import gql from '@cms-apis/graphql/tag';

import platformContent from './platform-content.js';
import websiteSection from './website-section.js';

export default gql`

directive @interfaceFields on OBJECT

type Query {
  ping: String!
}

${platformContent}
${websiteSection}

`;
