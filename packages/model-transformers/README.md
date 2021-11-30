# Legacy Data Model Transformers

## Root Content
- [x] `taxonomy` field
- [x] `gating` field
- [x] `statusText` field (if needed?)
- [x] `metadata` field
- [x] `siteContext` object field
- [x] core section query field
- [x] `customAttributes`
- [x] `userRegistration` field
- [x] `redirectTo` field (if needed?)
- [x] core canonical URL field
- [x] core `noIndex` field

## Content Interfaces
- [x] Addressable
- [x] Authorable
- [x] Contactable
- [ ] Inquirable
  - `inquiryEmails` field
- [x] Media
- [x] OrganizationContactable
- [x] PrimaryCategory
- [x] SidebarEnabled
- [x] SocialLinkable

## Content Types
- [x] Article
- [x] Blog
- [x] Company
  - [x] `companyType` field
  - [x] `brandsCarried` and `companyCompetitors`
  - [x] custom "stats" fields, such as `numberOfEmployees`
  - [x] `youtube` and `youtubeVideos`
  - [x] `featuredCategories` (removed, no longer used)
- [x] Contact
- [x] Document
- [ ] Event
  - [x] `startDate` and `endDate` fields
  - [x] `allDay` flag
  - [x] `cost`, `eventType`, and `beneficiary` fields
  - [ ] `venue` and `organization` Entity references
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
- [x] Video
  - [x] determine if `embedSrc` needs to be added
- [x] Webinar
  - [x] `sponsors` field
  - [x] `startDate` field
  - [x] `linkUrl` field
- [x] Whitepaper

## Find Field Script
```js
((db) => {
  const dbPattern = /_platform$/;
  const collection = 'Content';
  const field = 'mutations.Website.primaryCategory';
  const r = db.getSiblingDB('admin').runCommand({ listDatabases: 1 });

  const dbNames = r.databases.filter(({ name }) => dbPattern.test(name)).map(({ name }) => name);
  const results = dbNames.map((dbName) => {
    const current = db.getSiblingDB(dbName);
    const values = current.getCollection(collection)
      .distinct(field, { [field]: { $exists: true } });
    return { dbName, field, n: values.length };
  });
  print(results);
})(db);
```
