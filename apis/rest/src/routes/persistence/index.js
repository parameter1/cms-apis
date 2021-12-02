import { Router } from 'express';
import schema from '../../graphql/schema/index.js';
import createRouter from './create-router.js';

const persistance = Router();

const models = schema.getModels();

models.forEach((model) => {
  persistance.use(model.path, createRouter({ models, restType: model.restType }));
});

export default persistance;
