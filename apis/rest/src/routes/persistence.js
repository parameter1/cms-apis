import { Router } from 'express';
import models from '../models/index.js';

const createModelRouter = (model) => {
  const router = Router();
  const meta = { model: model.meta };

  router.get('/', (req, res) => {
    res.json({ data: [], included: [], meta });
  });

  router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ data: { id }, included: [], meta });
  });

  router.post('/', (req, res) => {
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
  persistance.use(model.path, createModelRouter(model));
});

export default persistance;
