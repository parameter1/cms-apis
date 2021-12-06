import { Router } from 'express';
import createError from 'http-errors';
import schema from '../../graphql/schema/index.js';
import createRouter from './create-router.js';

const persistance = Router();

const models = schema.getModels();

models.forEach((model) => {
  persistance.use(model.getPath(), (req, res, next) => {
    const { subtype } = req.params;
    if (!subtype || model.hasSubTypePath(subtype)) return next();
    throw createError(404, `The subtype ${subtype} was not found for this model.`);
  }, createRouter({ model }));

  // also mount the "root class" router (when applicable)
  if (model.getIsPolymorphic()) persistance.use(`/${model.getRestType()}`, createRouter({ model }));
});

export default persistance;
