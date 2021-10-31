import gql from '@cms-apis/graphql/tag';
import batchReplace from '../batch-replace.js';

export default async ({ dbs, graphql }) => batchReplace({
  graphql,
  operation: 'emailNewsletters',
  upsertTo: dbs.main.repo('email-newsletters'),
  fragment: gql`
    fragment TransformEmailNewsletterFragment on EmailNewsletter {
      _id
      name
      alias
      tagLine
      description
      logo
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
