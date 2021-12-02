import gql from '@cms-apis/graphql/tag';
import createFragment from './create-fragment.js';

export default ({
  idType,
  type,
  attributes,
  relationships,
  queryName,
} = {}) => {
  const { spreadFragmentName, processedFragment } = createFragment({
    type,
    attributes,
    relationships,
  });
  const inputName = `QueryById${idType}Input!`;
  return gql`
    query ${type}ById($input: ${inputName}) {
      ${queryName}(input: $input) {
        ${spreadFragmentName}
      }
    }
    ${processedFragment}
  `;
};
