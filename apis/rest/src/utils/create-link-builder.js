import inflector from 'inflected';

const dasherize = (value) => inflector.dasherize(inflector.underscore(value));

export default ({ req, tenant, endpointVar = 'PERSISTENCE_ENDPOINT' }) => {
  const { constants } = req.app.locals;
  const endpoint = constants[endpointVar];
  const rootUrl = `${req.protocol}://${req.get('host')}${constants.API_PATH}${endpoint}`;

  const linkSelf = ({ id, restType, field } = {}) => `${rootUrl}/${restType}/${id}/links/${dasherize(field)}?x-tenant-key=${tenant}`;
  const linkRelated = ({ id, restType, field } = {}) => `${rootUrl}/${restType}/${id}/${dasherize(field)}?x-tenant-key=${tenant}`;

  return {
    self: ({ id, restType } = {}) => `${rootUrl}/${restType}/${id}?x-tenant-key=${tenant}`,
    linkSelf,
    linkRelated,
    linkage: ({ id, restType, field }) => ({
      self: linkSelf({ id, restType, field }),
      related: linkRelated({ id, restType, field }),
    }),
  };
};
