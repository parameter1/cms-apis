import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  loadWebsiteRedirects(input: LoadManyQueryInput!): [WebsiteRedirect!]!
    @query(kind: LOAD_MANY)
  websiteRedirectById(input: FindByIdQueryInput!): WebsiteRedirect
    @query(kind: FIND_BY_ID)
  websiteRedirects(input: FindQueryInput = {}): [WebsiteRedirect!]!
    @query(kind: FIND)
}

type WebsiteRedirect @meta(
  restType: "website/redirects"
  repoName: "website-redirects"
) {
  id: ObjectID!
  type: String!
  links: WebsiteRedirectLinks!

  code: Int! @project
  from: String! @project @trim
  to: String! @project @trim
}

type WebsiteRedirectLinks {
  self: String!
  siteId: LinkOne! @linkage(
    restType: "website/product/site"
    field: "website"
  )
}

`;
