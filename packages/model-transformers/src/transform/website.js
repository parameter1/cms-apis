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
      date {
        timezone
        format
        locale
      }
      language {
        code
        primaryCode
        subCode
      }
      rootSectionConnection {
        edges {
          node {
            _id
            alias
            name
            status
          }
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
