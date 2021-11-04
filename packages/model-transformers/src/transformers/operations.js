import gql from '@cms-apis/graphql/tag';
import { COMMON_IMAGE_ASSET_REL } from './fragments.js';

export default new Map([
  ['allContent', {
    collection: 'content',
    fragment: gql`
      fragment TransformContentFragment on Content {
        _id
        _type
        _connection {
          contacts {
            type
            node {
              _id
              name { default website short }
              status
              date { published expired }
              contact { person { name firstName lastName title } }
            }
          }
          images { node { ...CommonImageAssetRelFragment } }
          relatedTo { node { _id _type name { default website short } status date { published expired } } }
          sponsors { node { _id _type name { default website short } status date { published expired } } }
        }
        _edge {
          company { node { _id name { default website short } status date { published expired } inquiry { isEnabled } } }
          parent { node { _id _type status name { default } date { published expired } } }
          primaryImage { node { ...CommonImageAssetRelFragment } }
          primaryWebsiteSection {
            node {
              _id
              _connection { ancestors { node { _id name { default } alias status } } }
              _edge { website { node { _id name status } } }
              name { default }
              alias
            }
          }
          createdBy { node { _id name username email } }
          updatedBy { node { _id name username email } }
        }
        _sync { date }
        alias
        body { default newsletter magazine website original }
        contact {
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
          phone { default tollfree fax mobile }
          email { default public }
          person { name firstName lastName title }
        }
        custom
        date { expired published created updated touched started ended }
        hash
        inquiry { isEnabled }
        labels
        links {
          redirect { url label }
          external { key url label }
          website
          social { provider url label }
        }
        media { file { name path } source { id key } duration embedCode credit }
        meta {
          company {
            _connection {
              brandsCarried { node { _id _type name { default } status } }
              competitors { node { _id _type name { default } status } }
            }
            type
            statesServed
            numberOfEmployees
            trainingInformation
            yearsInOperation
            salesRegion
            servicesProvided
            salesChannels
            productSummary
            serviceInformation
            warrantyInformation
            youtube { username channelId playlistId }
          }
          event { type cost beneficiary allDay }
          job {
            type
            salary
            city
            state
            email
            information
            phone
            website
            sourceUrl
          }
          product { modelNumber status }
          venue {
            totalCapacity
            spaces {
              _id
              _edge {
                floorPlan { node { ...CommonImageAssetRelFragment } }
              }
              name
              area
              capacity { min maxSeated maxStanding }
            }
          }
        }
        name { default newsletter magazine website short full headline }
        note
        redirects
        seo { title description }
        sidebars {
          body
          name
          label
          sequence
        }
        slug
        status
        syndication { source byline }
        teaser { default newsletter magazine website deck }
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
        _connection {
          sections { node { _id name { default } status } }
        }
        _edge {
          website { node { _id name status } }
        }
        _sync { date }
        alias
        defaults { fromName subjectLine testers { firstName lastName email } }
        description
        logo
        name
        provider { type providerId attributes }
        sourceProvider { handlerKey host path }
        status
        tagLine
        teaser
        usesDeploymentDates
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
        _edge {
          newsletter { node { _id name status } }
        }
        _sync { date }
        alias
        description
        name { default full }
        sequence
        status
      }
    `,
  }],
  ['users', {
    collection: 'users',
    fragment: gql`
      fragment TransformUserFragment on User {
        _id
        _sync { date }
        date { lastLoggedIn }
        email
        firstName
        isEnabled
        lastName
        mustChangePassword
        name
        password
        roles
        username
      }
    `,
  }],
  ['websites', {
    collection: 'websites',
    fragment: gql`
      fragment TransformWebsiteFragment on Website {
        _id
        _connection {
          sections {
            node {
              _id
              alias # rel query input
              name { default full } # global website section sort field
              sequence # global website section sort field
              status # rel query input
              depth # rel query input
            }
          }
          scheduleOptions { node { _id name { default } status } }
        }
        _sync { date }
        abbreviation
        description
        host { root asset image }
        logo
        name
        origin
        settings { date { timezone format locale } language { code primaryCode subCode } }
        status
        tagLine
      }
    `,
  }],
  ['websiteInquirySubmissions', {
    collection: 'website-inquiry-submissions',
    fragment: gql`
      fragment TransformWebsiteInquirySubmissionFragment on WebsiteInquirySubmission {
        _id
        _edge { content { node { _id _type status } } }
        _sync { date }
        addresses { from to cc bcc }
        date { created }
        payload
      }
    `,
  }],
  ['websiteRedirects', {
    collection: 'website-redirects',
    fragment: gql`
      fragment TransformWebsiteRedirectFragment on WebsiteRedirect {
        _id
        _edge { website { node { _id name } } }
        _sync { date }
        code
        from
        to
      }
    `,
  }],
  ['websiteSchedules', {
    collection: 'website-schedules',
    fragment: gql`
      fragment TransformWebsiteScheduleFragment on WebsiteSchedule {
        _id
        _edge {
          content {
            node {
              _id
              _edge {
                primaryImage { node { _id } }
                primaryWebsiteSection { node { _id name { default full } alias status } }
              }
              _type
              date { published expired }
              status
            }
          }
          option { node { _id name { default } status } }
          section {
            node {
              _id
              _edge { website { node { _id name } } }
              alias
              name { default full }
              status
            }
          }
        }
        _sync { date }
        date { started ended }
        status
      }
    `,
  }],
  ['websiteScheduleOptions', {
    collection: 'website-schedule-options',
    fragment: gql`
      fragment TransformWebsiteScheduleOptionFragment on WebsiteScheduleOption {
        _id
        _edge { website { node { _id name status } } }
        _sync { date }
        description
        name { default full }
        status
      }
    `,
  }],
  ['websiteSections', {
    collection: 'website-sections',
    fragment: gql`
      fragment TransformWebsiteSectionFragment on WebsiteSection {
        _id
        _connection {
          ancestors {
            node { _id name { default full } alias status }
            depth
          }
          descendants {
            node { _id name { default full } alias status }
            depth
          }
        }
        _edge {
          coverImage { node { ...CommonImageAssetRelFragment } }
          logo { node { ...CommonImageAssetRelFragment } }
          parent { node { _id name { default full } alias status } }
          website { node { _id name status } }
        }
        _sync { date }
        alias
        depth
        description
        labels
        metadata { title description }
        name { default full }
        redirects
        sequence
        slug
        status
      }
      ${COMMON_IMAGE_ASSET_REL}
    `,
  }],
]);
