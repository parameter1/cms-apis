# Legacy Data Model Transformers

## Root Content
- [ ] `taxonomy` field
- [ ] `gating` field
- [ ] `statusText` field (if needed?)
- [ ] `metadata` field
- [ ] `siteContext` object field
- [ ] core section query field
- [ ] `customAttributes`
- [ ] `userRegistration` field
- [ ] `redirectTo` field (if needed?)
- [ ] core canonical URL field
- [ ] core `noIndex` field

## Content Interfaces
- [x] Addressable
- [x] Authorable
- [x] Contactable
- [ ] Inquirable
  - `inquiryEmails` field
- [x] Media
- [x] OrganizationContactable
- [ ] PrimaryCategory
- [x] SidebarEnabled
- [x] SocialLinkable

## Content Types
- [x] Article
- [x] Blog
- [ ] Company
  - [x] `companyType` field
  - `brandsCarried` and `companyCompetitors`
  - [x] custom "stats" fields, such as `numberOfEmployees`
  - [ ] `youtube` and `youtubeVideos`
  - [ ] `featuredCategories`
- [x] Contact
- [x] Document
- [ ] Event
  - [x] `startDate` and `endDate` fields
  - [x] `allDay` flag
  - [x] `cost`, `eventType`, and `beneficiary` fields
  - [ ] `venue` and `organization` Entity references
- [x] Job
  - [x] job specific fields, such as `jobType`, `salary` etc...
- [x] MediaGallery
- [x] News
- [x] Page
- [x] Podcast
- [x] PressRelease
- [x] Product
  - [x] `modelNumber` and `contentStatus` fields
- [x] Promotion
  - [x] `linkText` and `linkUrl` fields (handled by `links.primary.url` and `links.primary.label`)
- [x] Supplier
- [x] TextAd
  - [x] `linkText` and `linkUrl` fields
- [x] TopList
- [x] Venue
  - [x] `spaces` field
  - [x] `totalCapacity` field
- [ ] Video
  - [ ] determine if `embedSrc` needs to be added
- [x] Webinar
  - [x] `sponsors` field
  - [x] `startDate` field
  - [x] `linkUrl` field
- [x] Whitepaper
