import { fromJS } from '@cms-apis/immutable';
import types from './types.js';

export default fromJS([
  {
    name: 'document asset',
    collection: 'document-assets',
    legacy: {
      namespace: 'platform',
      model: 'Asset',
      target: { namespace: 'platform', model: 'Document' },
      query: { type: 'Document' },
    },
  },
  {
    name: 'image asset',
    collection: 'image-assets',
    legacy: {
      namespace: 'platform',
      model: 'Asset',
      target: { namespace: 'platform', model: 'Image' },
      query: { type: 'Image' },
    },
  },
  {
    name: 'auth token',
    collection: 'auth-tokens',
    legacy: { namespace: 'platform', model: 'AuthToken' },
  },
  {
    name: 'content',
    collection: 'content',
    legacy: {
      namespace: 'platform',
      model: 'Content',
      query: { type: { $in: Object.values(types.get('content').toJS()) } },
    },
  },
  {
    name: 'magazine',
    collection: 'magazines',
    legacy: {
      namespace: 'platform',
      model: 'Product',
      target: { namespace: 'magazine', model: 'Publication' },
      query: { type: 'Publication', status: 1 },
    },
  },
  {
    name: 'magazine issue',
    collection: 'magazine-issues',
    legacy: { namespace: 'magazine', model: 'Issue', query: { status: 1 } },
  },
  {
    name: 'magazine schedule',
    collection: 'magazine-schedules',
    legacy: { namespace: 'magazine', model: 'Schedule', query: { status: 1 } },
  },
  {
    name: 'magazine section',
    collection: 'magazine-sections',
    legacy: { namespace: 'magazine', model: 'Section', query: { status: 1 } },
  },
  {
    name: 'model history',
    collection: 'model-history',
    legacy: { namespace: 'platform', model: 'ModelHistory' },
  },
  {
    name: 'newsletter campaign',
    collection: 'newsletter-campaigns',
    legacy: { namespace: 'email', model: 'Campaign', query: { status: 1 } },
  },
  {
    name: 'newsletter schedule',
    collection: 'newsletter-schedules',
    legacy: { namespace: 'email', model: 'Schedule', query: { status: 1 } },
  },
  {
    name: 'newsletter section',
    collection: 'newsletter-sections',
    legacy: { namespace: 'email', model: 'Section', query: { status: 1 } },
  },
  {
    name: 'newsletter',
    collection: 'newsletters',
    legacy: {
      namespace: 'platform',
      model: 'Product',
      target: { namespace: 'email', model: 'Newsletter' },
      query: { type: 'Newsletter', status: 1 },
    },
  },
  {
    name: 'taxonomy',
    collection: 'taxonomies',
    legacy: {
      namespace: 'platform',
      model: 'Taxonomy',
      query: { type: { $in: Object.values(types.get('taxonomy').toJS()) }, status: 1 },
    },
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
    legacy: { namespace: 'website', model: 'Schedule', query: { status: 1 } },
  },
  {
    name: 'website section',
    collection: 'website-sections',
    legacy: { namespace: 'website', model: 'Section', query: { status: 1 } },
    indexes: [
      {
        key: { alias: 1, '_edge.website.node._id': 1 },
        unique: true,
      },
    ],
  },
  {
    name: 'website schedule option',
    collection: 'website-schedule-options',
    legacy: { namespace: 'website', model: 'Option', query: { status: 1 } },
    indexes: [
      {
        key: { slug: 1, '_edge.website.node._id': 1 },
        unique: true,
      },
    ],
  },
  {
    name: 'website',
    collection: 'websites',
    indexes: [
      { key: { 'host.root': 1 }, unique: true },
    ],
    legacy: {
      namespace: 'platform',
      model: 'Product',
      target: { namespace: 'website', model: 'Site' },
      query: { type: 'Site', status: 1 },
    },
  },
]);
