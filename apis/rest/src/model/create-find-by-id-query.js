import gql from '@cms-apis/graphql/tag';
import createFragment from './create-fragment.js';

export default ({
  type,
  attributes,
  relationships,
  queryName,
  withLinkUrls = true,
  withLinkage = true,
} = {}) => {
  const { spreadFragmentName, processedFragment } = createFragment({
    type,
    attributes,
    relationships,
    withLinkUrls,
    withLinkage,
  });
  return gql`
    query ${type}ById($input: FindByIdQueryInput!) {
      ${queryName}(input: $input) {
        ${spreadFragmentName}
      }
    }
    ${processedFragment}
  `;
};
