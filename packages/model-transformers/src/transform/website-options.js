import gql from '@cms-apis/graphql/tag';
import batchReplace from '../batch-replace.js';

export default async ({ dbs, graphql }) => batchReplace({
  graphql,
  operation: 'websiteOptions',
  upsertTo: dbs.main.repo('website-options'),
  fragment: gql`
    fragment TransformWebsiteOptionFragment on WebsiteOption {
      _id
      name
      description
      status
      site {
        node {
          _id
          name # global website sort field
          status # rel query input
        }
      }
    }
  `,
});
