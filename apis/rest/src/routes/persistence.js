import { Router } from 'express';
import createError from 'http-errors';
import { get } from '@cms-apis/object-path';
import models from '../models/index.js';
import asyncRoute from '../utils/async-route.js';
import cleanNode from '../utils/clean-node.js';

/**
 * @see https://github.com/parameter1/base-platform/blob/0fd030927a06196b86b74894f60e5ee7b2317463/src/Cygnus/ModlrBundle/Controller/Api/AbstractController.php#L185
 * @param {object} query
 */
const parseQuery = (query) => {
  const limit = parseInt(query.limit, 10);
  const skip = parseInt(query.skip, 10);
  const parsed = {
    fields: new Set((query.fields || '').split(',').map((v) => v.trim()).filter((v) => v)),
    include: new Set((query.include || '').split(',').map((v) => v.trim()).filter((v) => v)),
    exclude: new Set((get(query, 'filter.exclude') || '').split(',').map((v) => v.trim()).filter((v) => v)),
    limit: limit > 0 ? limit : null,
    skip: skip > 0 ? skip : 0,
    sort: (query.sort || '').split(',').reduce((o, field) => {
      const pattern = /^-/;
      const trimmed = field.trim();
      if (!trimmed) return o;
      const dir = pattern.test(trimmed) ? -1 : 1;
      return { ...o, [trimmed.replace(pattern, '')]: dir };
    }, {}),
  };

  if (parsed.include.size && parsed.fields.size) {
    // ensure included/sideloaded values are also in the projection
    parsed.include.forEach((field) => parsed.fields.add(field));
  }

  if (parsed.fields.size && parsed.exclude.size) {
    // @see https://github.com/parameter1/base-platform/blob/0fd030927a06196b86b74894f60e5ee7b2317463/src/Cygnus/ModlrBundle/ApiNext/Resource/Persistence/Resource.php#L375
    throw createError(400, 'You cannot both include and exclude fields when querying the database.');
  }
  return parsed;
};

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
