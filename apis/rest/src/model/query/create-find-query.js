import gql from '@cms-apis/graphql/tag';
import createFragment from './create-fragment.js';

export default ({
  type,
  attributes,
  relationships,
  selected,
  included,
  queryName,
  withLinkUrls = true,
  withLinkage = true,
} = {}) => {
  const { spreadFragmentName, processedFragment } = createFragment({
    type,
    attributes,
    relationships,
    selected,
    included,
    withLinkUrls,
    withLinkage,
  });
  return gql`
    query Find${type}s($input: FindQueryInput!) {
      ${queryName}(input: $input) {
        ${spreadFragmentName}
      }
    }
    ${processedFragment}
  `;
};
