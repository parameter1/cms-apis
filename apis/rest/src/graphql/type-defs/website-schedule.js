import gql from '@cms-apis/graphql/tag';

export default gql`

extend type Query {
  loadWebsiteSchedules(input: LoadManyQueryInput!): [WebsiteSchedule!]!
    @query(kind: LOAD_MANY)
  websiteScheduleById(input: FindByIdQueryInput!): WebsiteSchedule
    @query(kind: FIND_BY_ID)
  websiteSchedules(input: FindQueryInput = {}): [WebsiteSchedule!]!
    @query(kind: FIND)
}

type WebsiteSchedule @meta(
  restType: "website/schedule"
  repoName: "website-schedules"
) {
  id: ObjectID!
  type: String!
  links: WebsiteScheduleLinks!

  contentStatus: Int! @project(field: "_edge.content.node.status")
  endDate: DateTime @project(field: "date.ended")
  expires: DateTime @project(field: "_edge.content.node.date.expired")
  hasPrimaryImage: Boolean @project(field: "_edge.content.node._edge.primaryImage.node._id")
  published: DateTime @project(field: "_edge.content.node.date.published")
  startDate: DateTime @project(field: "date.started")
  status: Int! @status # no longer used
}


type WebsiteScheduleLinks {
  self: String!
  categories: LinkMany! @linkage(
    restType: "platform/taxonomy"
    field: "taxonomies"
  )
  content: LinkOne! @linkage(
    restType: "platform/content"
  )
  # no longer used
  featuredCategories: LinkMany! @linkage(
    restType: "platform/taxonomy"
    empty: true
  )
  option: LinkOne! @linkage(
    restType: "website/option"
  )
  primarySection: LinkOne! @linkage(
    restType: "website/section"
    field: "content.node._edge.primaryWebsiteSection"
  )
  product: LinkOne! @linkage(
    restType: "website/product/site"
    field: "section.node._edge.website"
  )
  section: LinkOne! @linkage(
    restType: "website/section"
  )
}

`;
