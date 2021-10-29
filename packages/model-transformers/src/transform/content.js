import gql from '@cms-apis/graphql/tag';

const query = gql`

query TransformContentById($input: QueryContentInterfaceByIdInput!) {
  transformed: contentInterfaceById(input: $input) {
    _id
    _type
    name {
      default
      magazine
      newsletter
      website
    }
    teaser {
      default
      magazine
      newsletter
      website
    }
    body {
      default
      magazine
      newsletter
      website
    }
    primaryWebsiteSectionEdge {
      node {
        _id
        name
        alias
        canonicalPath
        ancestorConnection {
          edges {
            node {
              _id
              name
              alias
              canonicalPath
            }
          }
        }
        websiteEdge {
          node {
            _id
            name
          }
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
