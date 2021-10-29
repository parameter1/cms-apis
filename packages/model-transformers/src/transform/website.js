import gql from '@cms-apis/graphql/tag';

const query = gql`
  query TransformWebsiteById($input: QueryWebsiteByIdInput!) {
    transformed: websiteById(input: $input) {
      _id
      name
      fullName
      tagLine
      description
      logo
      status
      url
      title
      shortName
      hosts {
        root
        asset
        image
      }
      origin
    }
  }
`;

export default async ({ id, graphql }) => {
  const input = { id };
  const { data } = await graphql.query({ query, variables: { input } });
  return data.transformed;
};
