import { createServer } from 'http';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes/index.js';

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

  routes(app);

  return createServer(app);
};
