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
          taxonomies { node { _id _type name { default hierarchical } } }
          websiteSchedules {
            node {
              _edge {
                option { node { _id name { default } } }
                section {
                  node {
                    _id alias name { default }
                    _edge { website { node { _id name } } }
                    _connection { descendants { node { _id } } }
                  }
                }
              }
              date { started ended }
            }
          }
        }
        _edge {
          company { node { _id name { default website short } status date { published expired } inquiry { isEnabled } } }
          parent { node { _id _type status name { default } date { published expired } } }
          primaryCategory { node { _id _type name { default full } } }
          primaryImage { node { ...CommonImageAssetRelFragment } }
          primaryWebsiteSection {
            node {
              _id
              _connection { ancestors { node { _id name { default } alias } } }
              _edge { website { node { _id name } } }
              name { default }
              alias
            }
          }
          createdBy { node { _id name { full } username email } }
          updatedBy { node { _id name { full } username email } }
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
        media { file { name path } source { id key } duration embed { code url } credit }
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
        seo { title description canonicalUrl noIndex }
        sidebars {
          body
          name
          label
          sequence
        }
        status
        syndication { source byline }
        teaser { default newsletter magazine website deck }
        website {
          description pathSuffix slug title
          gating { requiredRole form { identifier provider } }
          userRegistration { isRequired accessLevels }
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
        _sync { date }
        alt
        approvedFor { website magazine }
        body
        caption
        credit
        crop { dimensions { x1 x2 y1 y2 aspectRatio } rectangle { x y width height } }
        date { touched }
        file { name path original }
        height
        inCarousel
        isLogo
        name { default display }
        note
        primaryImageDisplay
        width
      }
    `,
  }],
  ['magazines', {
    collection: 'magazines',
    fragment: gql`
      fragment TransformMagazineFragment on Magazine {
        _id
        _connection {
          issues { node { _id name { default } date { mailed } _edge { coverImage { node { _id } } } } }
          sections { node { _id name { default } } }
        }
        _edge {
          image { node { ...CommonImageAssetRelFragment } }
        }
        _sync { date }
        description
        name
        links { subscribe renewal reprint einquiry social { provider url label } }
      }
      ${COMMON_IMAGE_ASSET_REL}
    `,
  }],
  ['magazineIssues', {
    collection: 'magazine-issues',
    fragment: gql`
      fragment TransformMagazineIssueFragment on MagazineIssue {
        _id
        _edge {
          coverImage { node { ...CommonImageAssetRelFragment } }
          magazine { node { _id name } }
        }
        _sync { date }
        coverDescription
        credit
        date { mailed }
        dedication
        description
        name { default full }
        url { digitalEdition }
      }
      ${COMMON_IMAGE_ASSET_REL}
    `,
  }],
  ['magazineSchedules', {
    collection: 'magazine-schedules',
    fragment: gql`
      fragment TransformMagazineScheduleFragment on MagazineSchedule {
        _id
        _edge {
          content {
            node {
              _id _type status
              _edge { primaryImage { node { _id } } }
            }
          }
          section {
            node {
              _id
              _edge {
                issue { node { _id name { default } } }
                magazine { node { _id name } }
              }
              name { default full }
            }
          }
        }
        _sync { date }
      }
    `,
  }],
  ['magazineSections', {
    collection: 'magazine-sections',
    fragment: gql`
      fragment TransformMagazineSectionFragment on MagazineSection {
        _id
        _edge {
          magazine { node { _id name } }
          issue { node { _id name { default } date { mailed } } }
        }
        _sync { date }
        description
        name { default full }
        isGlobal
        sequence
      }
    `,
  }],
  ['newsletters', {
    collection: 'newsletters',
    fragment: gql`
      fragment TransformNewsletterFragment on Newsletter {
        _id
        _connection {
          sections { node { _id name { default } } }
        }
        _edge {
          website { node { _id name } }
        }
        _sync { date }
        alias
        defaults { fromName subjectLine testers { firstName lastName email } }
        description
        name
        provider { type providerId attributes }
        sourceProvider { handlerKey host path }
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
        _edge {
          createdBy { node { _id name { full } email username } }
          newsletter { node { _id name _edge { website { node { _id name } } }  } }
        }
        _sync { date }
        date { created updated touched deployed scheduled htmlUpdated }
        externalId
        html
        isLocked
        list { identifier message status }
        name { default from }
        subjectLine
      }
    `,
  }],
  ['newsletterSchedules', {
    collection: 'newsletter-schedules',
    fragment: gql`
      fragment TransformNewsletterScheduleFragment on NewsletterSchedule {
        _id
        _edge {
          content { node { _id _type status } }
          section { node { _id name { default } _edge { newsletter { node { _id name } } } } }
        }
        _sync { date }
        date { deployed }
        sequence
      }
    `,
  }],
  ['newsletterSections', {
    collection: 'newsletter-sections',
    fragment: gql`
      fragment TransformNewsletterSectionFragment on NewsletterSection {
        _id
        _edge {
          newsletter { node { _id name } }
        }
        _sync { date }
        alias
        description
        name { default full }
        sequence
      }
    `,
  }],
  ['taxonomies', {
    collection: 'taxonomies',
    fragment: gql`
      fragment TransformTaxonomyFragment on Taxonomy {
        _id
        _connection {
          ancestors {
            depth
            node { _id _type name { default hierarchical } path }
          }
          descendants {
            depth
            node { _id _type name { default hierarchical } path }
          }
        }
        _edge {
          parent { node { _id _type name { default hierarchical } path } }
        }
        _sync { date }
        _type
        depth
        description
        isHierarchical
        name { default full hierarchical }
        path
        sequence
        slug
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
        isEnabled
        mustChangePassword
        name { first last full }
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
              depth # rel query input
            }
          }
          scheduleOptions { node { _id name { default } } }
        }
        _sync { date }
        abbreviation
        description
        host { root asset image }
        name
        origin
        settings { date { timezone format locale } language { code primaryCode subCode } }
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
        _connection {
          taxonomies { node { _id _type name { default hierarchical } } }
        }
        _edge {
          content {
            node {
              _id
              _edge {
                primaryImage { node { _id } }
                primaryWebsiteSection { node { _id name { default full } alias } }
              }
              _type
              date { published expired }
              status
            }
          }
          option { node { _id name { default } } }
          section {
            node {
              _id
              _edge { website { node { _id name } } }
              alias
              name { default full }
            }
          }
        }
        _sync { date }
        date { started ended }
      }
    `,
  }],
  ['websiteScheduleOptions', {
    collection: 'website-schedule-options',
    fragment: gql`
      fragment TransformWebsiteScheduleOptionFragment on WebsiteScheduleOption {
        _id
        _edge { website { node { _id name } } }
        _sync { date }
        description
        name { default full }
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
            node { _id name { default full } alias }
            depth
          }
          descendants {
            node { _id name { default full } alias }
            depth
          }
          related { node { _id name { default full } alias } }
        }
        _edge {
          coverImage { node { ...CommonImageAssetRelFragment } }
          logo { node { ...CommonImageAssetRelFragment } }
          parent { node { _id name { default full } alias } }
          website { node { _id name } }
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
        seo
        slug
      }
      ${COMMON_IMAGE_ASSET_REL}
    `,
  }],
]);
