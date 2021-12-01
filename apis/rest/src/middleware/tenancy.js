import createError from 'http-errors';
import createDb from '../mongodb/create-db.js';
import createGraphQLClient from '../graphql/create-client.js';

const param = 'x-tenant-key';

export default () => (req, res, next) => {
  const tenant = req.headers[param] || req.query[param];
  if (!tenant) throw createError(400, 'You must provide a tenant via the `x-tenant-key` header or query string parameter.');
  const db = createDb({ tenant });
  res.locals.tenant = tenant;
  res.locals.db = db;
  res.locals.graphql = createGraphQLClient({ db, tenant });
  next();
};
