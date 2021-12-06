import { Router } from 'express';
import schema from '../../graphql/schema/index.js';
import createRouter from './create-router.js';

const persistance = Router();

const models = schema.getModels();

models.forEach((model) => {
  persistance.use(model.getPath(), createRouter({ model }));

  // also mount the "root class" router (when applicable)
  if (model.getIsPolymorphic()) persistance.use(`/${model.getRestType()}`, createRouter({ model }));
});

export default persistance;
