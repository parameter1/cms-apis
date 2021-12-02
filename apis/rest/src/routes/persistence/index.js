import { Router } from 'express';
import schema from '../../graphql/schema/index.js';
import createRouter from './create-router.js';

const persistance = Router();

const models = schema.getModels();

models.forEach((model) => {
  persistance.use(model.getPath(), createRouter({ models, restType: model.getRestType() }));
});

export default persistance;
