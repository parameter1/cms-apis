import gql from '@cms-apis/graphql/tag';
import batchReplace from '../batch-replace.js';

export default async ({ dbs, graphql }) => batchReplace({
  graphql,
  operation: 'websiteRedirects',
  upsertTo: dbs.main.repo('website-redirects'),
  fragment: gql`
    fragment TransformWebsiteRedirectFragment on WebsiteRedirect {
      _id
      from
      to
      code
      website {
        node {
          _id
          name # global website sort field
        }
      }
    }
  `,
});
