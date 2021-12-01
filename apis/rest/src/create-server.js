import { createServer } from 'http';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes/index.js';
import tenancy from './middleware/tenancy.js';
import jsonErrorHandler from './middleware/json-error-handler.js';
import notFoundHandler from './middleware/not-found-handler.js';

const CORS = cors({
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  maxAge: 600,
});

export default () => {
  const app = express();
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(CORS);
  app.options('*', CORS);

  app.locals.constants = {
    API_PATH: '/api/2.0rcpi',
    PERSISTENCE_ENDPOINT: '/persistence',
  };

  app.use(tenancy());

  routes(app);

  // error handlers
  app.use(notFoundHandler());
  app.use(jsonErrorHandler());

  return createServer(app);
};
