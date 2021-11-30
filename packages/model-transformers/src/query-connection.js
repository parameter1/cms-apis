import gql from '@cms-apis/graphql/tag';
import { extractFragmentData } from '@cms-apis/graphql/fragments';
import { ucFirst } from '@cms-apis/utils';

export default async ({
  graphql,
  operation,
  fragment,

  query,
  after,
  limit,
} = {}) => {
  const { spreadFragmentName, processedFragment } = extractFragmentData(fragment);
  const QUERY = gql`
    query Query${ucFirst(operation)}($input: PaginatedQueryInput = {}) {
      connection: ${operation}(input: $input) {
        edges {
          node {
            ${spreadFragmentName}
          }
        }
        pageInfo {
          totalCount
          hasNextPage
          endCursor
        }
      }
    }
    ${processedFragment}
  `;

  const input = { query, after, limit };
  const { data } = await graphql.query({ query: QUERY, variables: { input } });
  return data.connection;
};
