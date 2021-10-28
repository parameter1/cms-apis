import gql from '@cms-apis/graphql/tag';

const query = gql`

query TransformContentById($input: QueryContentInterfaceByIdInput!) {
  transformed: contentInterfaceById(input: $input) {
    _id
    _type
    name {
      default
      email
      magazine
      website
    }
    teaser {
      default
      email
      magazine
      website
    }
    body {
      default
      email
      magazine
      website
    }
    primaryWebsiteSectionEdge {
      node {
        _id
        name
        alias
        canonicalPath
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