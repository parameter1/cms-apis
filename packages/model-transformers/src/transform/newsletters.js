import gql from '@cms-apis/graphql/tag';
import batchReplace from '../batch-replace.js';

export default async ({ dbs, graphql }) => batchReplace({
  graphql,
  operation: 'newsletters',
  upsertTo: dbs.main.repo('newsletters'),
  fragment: gql`
    fragment TransformNewsletterFragment on Newsletter {
      _id
      name
      alias
      teaser
      tagLine
      description
      logo
      status
      usesDeploymentDates
      defaults {
        fromName
        subjectLine
        testers {
          firstName
          lastName
          email
        }
      }
      provider {
        type
        providerId
        attributes
      }
      sourceProvider {
        handlerKey
        host
        path
      }
      sections {
        node {
          _id
          name
          status
        }
      }
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
