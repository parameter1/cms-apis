import gql from '@cms-apis/graphql/tag';
import batchReplace from '../batch-replace.js';

export default async ({ dbs, graphql }) => batchReplace({
  graphql,
  operation: 'newsletterSections',
  upsertTo: dbs.main.repo('newsletter-sections'),
  fragment: gql`
    fragment TransformNewsletterSectionFragment on NewsletterSection {
      _id
      name
      description
      fullName
      status
      sequence
      seoTitle
      alias
      redirects
      slug
      newsletter {
        node {
          _id
          name # global newsletter sort field
          status # rel query input
        }
      }
    }
  `,
});
