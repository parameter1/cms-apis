import inflector from 'inflected';

const dasherize = (value) => inflector.dasherize(inflector.underscore(value));

export default ({ req, tenant, endpointVar = 'PERSISTENCE_ENDPOINT' }) => {
  const { constants } = req.app.locals;
  const endpoint = constants[endpointVar];
  const rootUrl = `${req.protocol}://${req.get('host')}${constants.API_PATH}${endpoint}`;

  const linkSelf = ({ id, type, field } = {}) => `${rootUrl}/${type}/${id}/links/${dasherize(field)}?x-tenant-key=${tenant}`;
  const linkRelated = ({ id, type, field } = {}) => `${rootUrl}/${type}/${id}/${dasherize(field)}?x-tenant-key=${tenant}`;

  return {
    self: ({ id, type } = {}) => `${rootUrl}/${type}/${id}?x-tenant-key=${tenant}`,
    linkSelf,
    linkRelated,
    linkage: ({ id, type, field }) => ({
      self: linkSelf({ id, type, field }),
      related: linkRelated({ id, type, field }),
    }),
  };
};
