import { Router } from 'express';
import persistence from './persistence.js';

export default (app) => {
  app.get('/', (_, res) => {
    res.json({ ping: 'pong' });
  });

  const api = Router();
  api.use('/persistence', persistence);

  app.use('/api/2.0rcpi', api);
};
