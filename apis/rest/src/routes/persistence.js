import { Router } from 'express';
import createError from 'http-errors';
import models from '../models/index.js';
import asyncRoute from '../utils/async-route.js';
import cleanNode from '../utils/clean-node.js';

const createModelRouter = (model) => {
  const router = Router();
  const meta = { model: model.getMeta() };

  router.get('/', (req, res) => {
    res.json({ data: [], included: [], meta });
  });

  /**
   * Retrieve one by ID.
   */
  router.get('/:id', asyncRoute(async (req, res) => {
    const doc = await model.findOneById({ graphql: res.locals.graphql, id: req.params.id });
    if (!doc) throw createError(404, 'No models found using the criteria provided.');
    res.json({ data: cleanNode(doc), included: [], meta });
  }));

  router.post('/', (req, res) => {
    res.json({ data: [], included: [], meta });
  });

  router.post('/query', (req, res) => {
    res.json({ data: [], included: [], meta });
  });

  router.patch('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ data: { id }, included: [], meta });
  });

  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ data: { id }, included: [], meta });
  });

  return router;
};

const persistance = Router();

models.forEach((model) => {
  persistance.use(model.getPath(), createModelRouter(model));
});

export default persistance;
