import gql from '@cms-apis/graphql/tag';

export default gql`

type WebsiteSection {
  id: Int!
  type: String!

  # accessControl: [String!]!
  alias: String @trim
  canonicalUrl: String @trim(field: "seo.canonicalUrl")
}

`;
