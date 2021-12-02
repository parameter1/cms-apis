import { Router } from 'express';
import persistence from './persistence/index.js';

export default (app) => {
  const { constants } = app.locals;
  app.get('/', (_, res) => {
    res.json({ ping: 'pong' });
  });

  const api = Router();
  api.use(constants.PERSISTENCE_ENDPOINT, persistence);

  app.use(constants.API_PATH, api);
};
