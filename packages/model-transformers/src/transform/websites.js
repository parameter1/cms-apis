import gql from '@cms-apis/graphql/tag';
import batchReplace from '../batch-replace.js';

export default async ({ dbs, graphql }) => batchReplace({
  graphql,
  operation: 'websites',
  upsertTo: dbs.main.repo('websites'),
  fragment: gql`
    fragment TransformWebsiteFragment on Website {
      _id
      name
      tagLine
      description
      logo
      status
      abbreviation
      hosts { root asset image }
      origin
      settings {
        date { timezone format locale }
        language { code primaryCode subCode }
      }
      sections {
        node {
          _id
          alias # rel query input
          name # global website section sort field
          fullName # global website section sort field
          sequence # global website section sort field
          status # rel query input
          depth # rel query input
        }
      }
      sectionOptions {
        node {
          _id
          name # global website option sort field
          status # rel query input
        }
      }
    }
  `,
});
