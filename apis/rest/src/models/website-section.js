import gql from '@cms-apis/graphql/tag';
import Model from './-abstract.js';

const FRAGMENT = gql`
  fragment WebsiteSectionResponseFragment on WebsiteSection {
    id
    type

    accessControl
    alias
    canonicalUrl
    descendantIds
    description
    fullName
    labels
    links {
      self
    }
    legacy
    name
    redirects
    seoDescription
    seoTitle
    sequence
    slug
    status
  }
`;

const FIND_BY_ID = gql`
  query WebsiteSectionById($input: QueryWebsiteSectionByIdInput!) {
    websiteSectionById(input: $input) {
      ...WebsiteSectionResponseFragment
    }
  }

  ${FRAGMENT}
`;

export default () => Model({
  emberType: 'website/section',
  findById: {
    query: FIND_BY_ID,
    resultKey: 'websiteSectionById',
  },
});
