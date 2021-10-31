import gql from '@cms-apis/graphql/tag';
import batchReplace from '../batch-replace.js';

export default async ({ dbs, graphql }) => batchReplace({
  graphql,
  operation: 'websiteScheduleOptions',
  upsertTo: dbs.main.repo('website-schedule-options'),
  fragment: gql`
    fragment TransformWebsiteScheduleOptionFragment on WebsiteScheduleOption {
      _id
      name
      description
      status
      website {
        node {
          _id
          name # global website sort field
          status # rel query input
        }
      }
    }
  `,
});
