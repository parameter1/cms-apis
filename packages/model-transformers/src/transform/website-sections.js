import gql from '@cms-apis/graphql/tag';
import batchReplace from '../batch-replace.js';

export default async ({ dbs, graphql }) => batchReplace({
  graphql,
  operation: 'websiteSections',
  upsertTo: dbs.main.repo('website-sections'),
  fragment: gql`
    fragment TransformWebsiteSectionFragment on WebsiteSection {
      _id
      name
      description
      fullName
      depth
      labels
      status
      sequence
      alias
      redirects
      slug
      metadata {
        title
        description
      }
      ancestors {
        node {
          _id
          name # commonly queried field
          alias # commonly queried field
          fullName
          status #rel query input
        }
        depth
      }
      descendants {
        node { _id name alias fullName status }
        depth
      }
      parent {
        node {
          _id
          name
          alias
          fullName
          status # rel query input
        }
      }
      website {
        node {
          _id
          name # global website sort field
          status # rel query input
        }
      }
      logo {
        node {
          _id
          name
          caption
          credit
          alt
          file { name path }
          width
          height
          crop {
            dimensions { x1 x2 y1 y2 }
            rectangle { x y width height }
          }
        }
      }
      coverImage {
        node {
          _id
          name
          caption
          credit
          alt
          file { name path }
          width
          height
          crop {
            dimensions { x1 x2 y1 y2 }
            rectangle { x y width height }
          }
        }
      }
    }
  `,
});
