import gql from '@cms-apis/graphql/tag';
import Model from './-abstract.js';

const ATTRIBUTE_FRAGMENT = gql`
  fragment WebsiteSectionAttributeFragment on WebsiteSection {
    id
    type

    accessControl
    alias
    canonicalUrl
    descendantIds
    description
    fullName
    labels
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

const FRAGMENT = gql`
  fragment WebsiteSectionResponseFragment on WebsiteSection {
    ...WebsiteSectionAttributeFragment
    links {
      self
      children { linkage { id type } }
      coverImage { linkage { id type } }
      logo { linkage { id type } }
      options { linkage { id type } }
      parent { linkage { id type } }
      relatedSections { linkage { id type } }
      relatedTaxonomy { linkage { id type } }
      site { linkage { id type } }
    }
  }

  ${ATTRIBUTE_FRAGMENT}
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
