import gql from '@cms-apis/graphql/tag';

const query = gql`
  query TransformWebsiteSectionOptionById($input: QueryWebsiteSectionOptionByIdInput!) {
    transformed: websiteSectionOptionById(input: $input) {
      _id
      name
      description
      status
      websiteEdge {
        node {
          _id
          name # global website search field
          status # rel query input
        }
      }
    }
  }
`;

export default async ({ id, graphql }) => {
  const input = { id };
  const { data } = await graphql.query({ query, variables: { input } });
  return data.transformed;
};
