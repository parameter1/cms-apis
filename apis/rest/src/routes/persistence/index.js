import { Router } from 'express';
import schema from '../../graphql/schema/index.js';
import createRouter from './create-router.js';

const persistance = Router();

const modelManager = schema.getModels();

modelManager.forEach((model) => {
  persistance.use(model.getPath(), createRouter({ modelManager, restType: model.getRestType() }));
});

export default persistance;
