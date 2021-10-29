import gql from '@cms-apis/graphql/tag';
import batchReplace from '../batch-replace.js';

export default async ({ dbs, graphql }) => batchReplace({
  graphql,
  operation: 'websiteSectionOptions',
  upsertTo: dbs.main.repo('website-section-options'),
  fragment: gql`
    fragment TransformWebsiteSectionOptionFragment on WebsiteSectionOption {
      _id
      name
      description
      status
      websiteEdge {
        node {
          _id
          name # global website sort field
          status # rel query input
        }
      }
    }
  `,
});
