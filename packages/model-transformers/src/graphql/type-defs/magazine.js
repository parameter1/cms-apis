import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  magazineById(input: QueryMagazineByIdInput!): Magazine
  magazines(input: PaginatedQueryInput = {}): QueryMagazinesConnection!
}

enum MagazineLinkSocialProviderEnum {
  FACEBOOK
  INSTAGRAM
  LINKEDIN
  PINTEREST
  TIKTOK
  TWITTER
  YOUTUBE
  OTHER
}


type Magazine {
  _id: ObjectID!
  _connection: Magazine_Connection!
  _edge: Magazine_Edge!
  _sync: SyncInfo!
  description: String @trim
  links: MagazineLinks! # combines root urls with social
  name: String! @trim
  tagLine: String @trim
}

type Magazine_Connection {
  issues: [MagazineIssuesEdge!]!
  sections: [MagazineSectionsEdge!]!
}

type Magazine_Edge {
  image: MagazineCoverImageEdge
}

type MagazineCoverImageEdge {
  node: ImageAsset!
}

type MagazineLinks {
  subscribe: String
  renewal: String
  reprint: String
  social: [MagazineLinkSocial!]!
  einquiry: String
}

type MagazineLinkSocial {
  provider: MagazineLinkSocialProviderEnum!
  url: String!
  label: String
}


type MagazineIssuesEdge {
  node: MagazineIssue!
}

type MagazineSectionsEdge {
  node: MagazineSection!
}

type QueryMagazinesConnection {
  edges: [QueryMagazinesConnectionEdge!]!
  pageInfo: PageInfo!
}

type QueryMagazinesConnectionEdge {
  node: Magazine!
  cursor: Cursor!
}

input QueryMagazineByIdInput {
  id: Int!
}

`;
