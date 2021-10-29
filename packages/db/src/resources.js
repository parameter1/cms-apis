import { fromJS } from '@cms-apis/immutable';

export default fromJS([
  {
    name: 'asset',
    collection: 'assets',
    legacy: { namespace: 'platform', model: 'Asset' },
  },
  {
    name: 'auth token',
    collection: 'auth-tokens',
    legacy: { namespace: 'platform', model: 'AuthToken' },
  },
  {
    name: 'content',
    collection: 'content',
    legacy: { namespace: 'platform', model: 'Content' },
  },
  {
    name: 'magazine',
    collection: 'magazines',
    legacy: { namespace: 'platform', model: 'Product' },
  },
  {
    name: 'magazine issue',
    collection: 'magazine-issues',
    legacy: { namespace: 'magazine', model: 'Issue' },
  },
  {
    name: 'magazine schedule',
    collection: 'magazine-schedules',
    legacy: { namespace: 'magazine', model: 'Schedule' },
  },
  {
    name: 'magazine section',
    collection: 'magazine-sections',
    legacy: { namespace: 'magazine', model: 'Section' },
  },
  {
    name: 'model history',
    collection: 'model-history',
    legacy: { namespace: 'platform', model: 'ModelHistory' },
  },
  {
    name: 'newsletter campaign',
    collection: 'newsletter-campaigns',
    legacy: { namespace: 'email', model: 'Campaign' },
  },
  {
    name: 'newsletter schedule',
    collection: 'newsletter-schedules',
    legacy: { namespace: 'email', model: 'Schedule' },
  },
  {
    name: 'newsletter section',
    collection: 'newsletter-sections',
    legacy: { namespace: 'email', model: 'Section' },
  },
  {
    name: 'newsletter',
    collection: 'newsletters',
    legacy: { namespace: 'platform', model: 'Product' },
  },
  {
    name: 'taxonomy',
    collection: 'taxonomies',
    legacy: { namespace: 'platform', model: 'Taxonomy' },
  },
  {
    name: 'user',
    collection: 'users',
    legacy: { namespace: 'platform', model: 'User' },
  },
  {
    name: 'website inquiry submission',
    collection: 'website-inquiry-submissions',
    legacy: { namespace: 'website', model: 'InquirySubmission' },
  },
  {
    name: 'website redirect',
    collection: 'website-redirects',
    legacy: { namespace: 'website', model: 'Redirects' },
  },
  {
    name: 'website schedule',
    collection: 'website-schedules',
    legacy: { namespace: 'website', model: 'Schedule' },
  },
  {
    name: 'website section',
    collection: 'website-sections',
    legacy: { namespace: 'website', model: 'Section' },
  },
  {
    name: 'website section option',
    collection: 'website-section-options',
    legacy: { namespace: 'website', model: 'Option' },
  },
  {
    name: 'website',
    collection: 'websites',
    legacy: { namespace: 'platform', model: 'Product' },
  },
]);
