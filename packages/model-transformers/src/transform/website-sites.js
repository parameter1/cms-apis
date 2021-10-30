import gql from '@cms-apis/graphql/tag';
import batchReplace from '../batch-replace.js';

export default async ({ dbs, graphql }) => batchReplace({
  graphql,
  operation: 'websiteSites',
  upsertTo: dbs.main.repo('website-sites'),
  fragment: gql`
    fragment TransformWebsiteSiteFragment on WebsiteSite {
      _id
      name
      fullName
      tagLine
      description
      logo
      status
      url
      title
      shortName
      hosts {
        root
        asset
        image
      }
      origin
      date {
        timezone
        format
        locale
      }
      language {
        code
        primaryCode
        subCode
      }
      sections {
        node {
          _id
          alias # rel query input
          name # global website section sort field
          fullName # global website section sort field
          sequence # global website section sort field
          status # rel query input
          isRoot # rel query input
        }
      }
      options {
        node {
          _id
          name # global website option sort field
          status # rel query input
        }
      }
    }
  `,
});
