import createError from 'http-errors';
import createDb from '../mongodb/create-db.js';
import createGraphQLClient from '../graphql/create-client.js';
import createLoaders from '../mongodb/create-loaders.js';
import ModelManager from '../model/manager.js';

const param = 'x-tenant-key';
const { log } = console;

export default () => (req, res, next) => {
  const tenant = req.headers[param] || req.query[param];
  if (!tenant) throw createError(400, 'You must provide a tenant via the `x-tenant-key` header or query string parameter.');
  const db = createDb({ tenant });
  res.locals.tenant = tenant;
  res.locals.db = db;
  const loaders = createLoaders({
    db,
    logger: process.env.NODE_ENV === 'development' ? log : null,
  });
  res.locals.loaders = loaders;

  const graphql = createGraphQLClient({
    db,
    loaders,
    req,
    tenant,
  });
  res.locals.graphql = graphql;

  res.locals.modelManager = ModelManager({ graphql });
  next();
};
