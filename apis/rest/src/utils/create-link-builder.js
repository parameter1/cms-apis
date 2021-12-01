export default ({ req, tenant, endpointVar = 'PERSISTENCE_ENDPOINT' }) => {
  const { constants } = req.app.locals;
  const endpoint = constants[endpointVar];
  const rootUrl = `${req.protocol}://${req.get('host')}${constants.API_PATH}${endpoint}`;
  return {
    self: ({ id, type } = {}) => `${rootUrl}/${type}/${id}?x-tenant-key=${tenant}`,
    linkSelf: ({ id, type, field } = {}) => `${rootUrl}/${type}/${id}/links/${field}?x-tenant-key=${tenant}`,
    linkRelated: ({ id, type, field } = {}) => `${rootUrl}/${type}/${id}/${field}?x-tenant-key=${tenant}`,
  };
};
