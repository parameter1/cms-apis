import gql from '@cms-apis/graphql/tag';
import { COMMON_IMAGE_ASSET_REL } from './fragments.js';

export default new Map([
  ['allContent', {
    collection: 'content',
    fragment: gql`
      fragment TransformContentFragment on Content {
        _id
        _type
        titles { default newsletter magazine website short full headline }
        teasers { default newsletter magazine website deck }
        bodies { default newsletter magazine website original }
        hash
        notes
        status
        dates { expired published created updated touched }
        seo { title description }
        alias
        slug
        redirects

        createdBy { node { _id name username email } }
        updatedBy { node { _id name username email } }
        company { node { _id titles { default website short } status dates { published expired } } }
        primaryImage { node { ...CommonImageAssetRelFragment } }
        images { node { ...CommonImageAssetRelFragment } }
        relatedTo { node { _id _type titles { default website short } status dates { published expired } } }
        primaryWebsiteSection {
          node {
            _id
            name
            alias
            ancestors {
              node {
                _id
                name
                alias
              }
            }
          }
        }
        contacts {
          type
          node {
            _id
            titles { default website short }
            status
            dates { published expired }
            contactInfo { person { name firstName lastName title } }
          }
        }
        sidebars {
          body
          name
          label
          sequence
        }
        address {
          street
          streetExtra
          city
          region
          postalCode
          country
          location { type coordinates }
          cityRegionPostalCode
        }
        contactInfo {
          phones { default tollfree fax mobile }
          emails { default public }
          website
          person { name firstName lastName title }
        }
      }
      ${COMMON_IMAGE_ASSET_REL}
    `,
  }],
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
        alt
        primaryImageDisplay
        dates { touched }
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
  ['magazines', {
    collection: 'magazines',
    fragment: gql`
      fragment TransformMagazineFragment on Magazine {
        _id
        name
        tagLine
        description
        logo
        status
        urls { subscribe renewal reprints einquiry }
        coverImage { node { ...CommonImageAssetRelFragment } }
        issues {
          node {
            _id
            name
            dates { mailed }
            coverImage { node { _id } }
          }
        }
        sections { node { _id name } }
      }
      ${COMMON_IMAGE_ASSET_REL}
    `,
  }],
  ['magazineIssues', {
    collection: 'magazine-issues',
    fragment: gql`
      fragment TransformMagazineIssueFragment on MagazineIssue {
        _id
        name
        fullName
        description
        dedication
        coverDescription
        credit
        redirects
        status
        dates { mailed }
        urls { digitalEdition }
        coverImage { node { ...CommonImageAssetRelFragment } }
        magazine {
          node {
            _id
            name
            status
          }
        }
      }
      ${COMMON_IMAGE_ASSET_REL}
    `,
  }],
  ['magazineSchedules', {
    collection: 'magazine-schedules',
    fragment: gql`
      fragment TransformMagazineScheduleFragment on MagazineSchedule {
        _id
        status
        content {
          node {
            _id
            _type
            status
            primaryImage { node { _id } }
          }
        }
        section {
          node {
            _id
            name
            fullName
            status
            issue { node { _id name status } }
            magazine { node { _id name status } }
          }
        }
      }
    `,
  }],
  ['magazineSections', {
    collection: 'magazine-sections',
    fragment: gql`
      fragment TransformMagazineSectionFragment on MagazineSection {
        _id
        name
        fullName
        description
        isGlobal
        status
        sequence
        magazine {
          node {
            _id
            name
          }
        }
        issue {
          node {
            _id
            name
            dates { mailed }
          }
        }
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
  ['newsletterSchedules', {
    collection: 'newsletter-schedules',
    fragment: gql`
      fragment TransformNewsletterScheduleFragment on NewsletterSchedule {
        _id
        deploymentDate
        status
        sequence
        content { node { _id _type status } }
        section {
          node {
            _id
            name
            status
            newsletter { node { _id name status } }
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
  ['websiteInquirySubmissions', {
    collection: 'website-inquiry-submissions',
    fragment: gql`
      fragment TransformWebsiteInquirySubmissionFragment on WebsiteInquirySubmission {
        _id
        payload
        addresses { from to cc bcc }
        dates { created }
        content { node { _id _type status } }
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
  ['websiteSchedules', {
    collection: 'website-schedules',
    fragment: gql`
      fragment TransformWebsiteScheduleFragment on WebsiteSchedule {
        _id
        status
        dates { start end }
        content {
          node {
            _id
            _type
            status
            primaryImage { node { _id } }
            dates { published expired }
            primaryWebsiteSection { node { _id name alias status } }
          }
        }
        section {
          node {
            _id
            alias
            name
            status
            website { node { _id name } }
          }
        }
        option { node { _id name status } }
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
        logo { node { ...CommonImageAssetRelFragment } }
        coverImage { node { ...CommonImageAssetRelFragment } }
      }
      ${COMMON_IMAGE_ASSET_REL}
    `,
  }],
]);
