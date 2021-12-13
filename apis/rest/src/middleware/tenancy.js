import createError from 'http-errors';
import { DataSources } from '@cms-apis/db';
import { inspect } from 'util';
import createDb from '../mongodb/create-db.js';
import createGraphQLClient from '../graphql/create-client.js';
import ModelManager from '../model/manager.js';

const param = 'x-tenant-key';
const { log } = console;

export default () => (req, res, next) => {
  const tenant = req.headers[param] || req.query[param];
  if (!tenant) throw createError(400, 'You must provide a tenant via the `x-tenant-key` header or query string parameter.');
  const db = createDb({
    tenant,
    logger: process.env.NODE_ENV === 'development' ? (...args) => log(inspect(args, { colors: true, depth: 5 })) : null,
  });
  res.locals.tenant = tenant;
  res.locals.db = db;

  const dataSources = new DataSources({ db });
  res.locals.dataSources = dataSources;

  const graphql = createGraphQLClient({
    db,
    loaders: db.loaders,
    req,
    tenant,
  });
  res.locals.graphql = graphql;

  res.locals.modelManager = ModelManager({ graphql });
  next();
};
