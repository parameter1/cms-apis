import gql from '@cms-apis/graphql/tag';

export default new Map([
  ['imageAssets', {
    collection: 'image-assets',
    fragment: gql`
      fragment TransformImageAssetFragment on ImageAsset {
        _id
        name
        caption
        credit
        isLogo
        body
        width
        height
        touched
        alt
        primaryImageDisplay
        file { name path }
        approvedFor { website magazine }
        crop {
          dimensions { x1 x2 y1 y2 aspectRatio }
          rectangle { x y width height }
        }
        source { location name width height processed }
      }
    `,
  }],
  ['newsletters', {
    collection: 'newsletters',
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
  }],
  ['newsletterCampaigns', {
    collection: 'newsletter-campaigns',
    fragment: gql`
      fragment TransformNewsletterCampaignFragment on NewsletterCampaign {
        _id
        name
        status
        externalId
        fromName
        html
        locked
        subjectLine
        dates {
          created
          updated
          touched
          deployment
          scheduled
          html
        }
        list { identifier message status }
        createdBy {
          node {
            _id
            name
            email
            username
          }
        }
        newsletter {
          node {
            _id
            name # global newsletter sort field
            status # rel query input
            website { node { _id name } }
          }
        }
      }
    `,
  }],
  ['newsletterSections', {
    collection: 'newsletter-sections',
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
  }],
  ['users', {
    collection: 'users',
    fragment: gql`
      fragment TransformUserFragment on User {
        _id
        email
        name
        firstName
        lastName
        username
        roles
        password
        lastLoggedIn
        enabled
        mustChangePassword
      }
    `,
  }],
  ['websites', {
    collection: 'websites',
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
        scheduleOptions {
          node {
            _id
            name # global website option sort field
            status # rel query input
          }
        }
      }
    `,
  }],
  ['websiteRedirects', {
    collection: 'website-redirects',
    fragment: gql`
      fragment TransformWebsiteRedirectFragment on WebsiteRedirect {
        _id
        from
        to
        code
        website {
          node {
            _id
            name # global website sort field
          }
        }
      }
    `,
  }],
  ['websiteScheduleOptions', {
    collection: 'website-schedule-options',
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
  }],
  ['websiteSections', {
    collection: 'website-sections',
    fragment: gql`
      fragment TransformWebsiteSectionFragment on WebsiteSection {
        _id
        name
        description
        fullName
        depth
        labels
        status
        sequence
        alias
        redirects
        slug
        metadata {
          title
          description
        }
        ancestors {
          node {
            _id
            name # commonly queried field
            alias # commonly queried field
            fullName
            status #rel query input
          }
          depth
        }
        descendants {
          node { _id name alias fullName status }
          depth
        }
        parent {
          node {
            _id
            name
            alias
            fullName
            status # rel query input
          }
        }
        website {
          node {
            _id
            name # global website sort field
            status # rel query input
          }
        }
        logo {
          node {
            _id
            name
            caption
            credit
            alt
            file { name path }
            width
            height
            crop {
              dimensions { x1 x2 y1 y2 }
              rectangle { x y width height }
            }
          }
        }
        coverImage {
          node {
            _id
            name
            caption
            credit
            alt
            file { name path }
            width
            height
            crop {
              dimensions { x1 x2 y1 y2 }
              rectangle { x y width height }
            }
          }
        }
      }
    `,
  }],
]);
