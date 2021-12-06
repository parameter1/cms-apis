import gql from '@cms-apis/graphql/tag';
import { extractFragmentData } from '@cms-apis/graphql/fragments';
import createAttributeFragment from './create-attribute-fragment.js';
import createLinksFragment from './create-links-fragment.js';

export default ({
  type,
  attributes = new Map(),
  relationships = new Map(),
  selected,
  included,
  withLinkUrls = true,
  withLinkage = true,
} = {}) => {
  const attrs = createAttributeFragment({ type, attributes, selected });
  const links = createLinksFragment({
    type,
    relationships,
    selected,
    included,
    withUrls: withLinkUrls,
    withLinkage,
  });

  const name = `${type}ResponseFragment${withLinkage ? 'WithLinkage' : ''}${withLinkUrls ? 'WithLinkUrls' : ''}`;

  return extractFragmentData(gql`
    fragment ${name} on ${type} {
      ${attrs.spreadFragmentName}
      ${links.spreadFragmentName}
    }

    ${attrs.processedFragment}
    ${links.processedFragment}
  `);
};
