const self = ({
  id,
  type,
  tenant,
  endpointVar = 'PERSISTENCE_ENDPOINT',
  req,
}) => {
  const { constants } = req.app.locals;
  const endpoint = constants[endpointVar];
  return `${req.protocol}://${req.get('host')}${constants.API_PATH}${endpoint}/${type}/${id}?x-tenant-key=${tenant}`;
};

export default { self };
