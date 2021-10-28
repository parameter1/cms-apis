export default [
  {
    namespace: 'email',
    models: [
      { legacy: 'Campaign', name: 'campaigns' },
      { legacy: 'Schedule', name: 'schedules' },
      { legacy: 'Section', name: 'sections' },
    ],
  },
  {
    namespace: 'magazine',
    models: [
      { legacy: 'Issue', name: 'issues' },
      { legacy: 'Schedule', name: 'schedules' },
      { legacy: 'Section', name: 'sections' },
    ],
  },
  {
    namespace: 'platform',
    models: [
      { legacy: 'Asset', name: 'assets' },
      { legacy: 'AuthToken', name: 'auth-tokens' },
      { legacy: 'Content', name: 'content' },
      { legacy: 'ModelHistory', name: 'model-history' },
      { legacy: 'Product', name: 'products' },
      { legacy: 'Taxonomy', name: 'taxonomies' },
      { legacy: 'User', name: 'users' },
    ],
  },
  {
    namespace: 'website',
    models: [
      { legacy: 'InquirySubmission', name: 'inquiry-submissions' },
      { legacy: 'Option', name: 'options' },
      { legacy: 'Redirects', name: 'redirects' },
      { legacy: 'Schedule', name: 'schedules' },
      { legacy: 'Section', name: 'sections' },
    ],
  },
].slice();
