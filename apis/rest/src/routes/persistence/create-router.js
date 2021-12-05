import { Router } from 'express';
import createError from 'http-errors';
import asyncRoute from '../../utils/async-route.js';
import parseQuery from '../../utils/parse-query.js';

export default ({ model } = {}) => {
  const restType = model.getRestType();
  const router = Router();
  const meta = { model: model.getMeta() };

  /**
   * Retrieve many.
   *
   * @todo handle include, exclude
   */
  router.get('/', asyncRoute(async (req, res) => {
    const { modelManager } = res.locals;
    const query = parseQuery(req.query, model);
    const docs = await modelManager.getQueryFor(restType).find({
      fields: query.fields,
      pagination: { limit: query.limit, skip: query.skip },
      sort: query.sort,
      withLinkUrls: false,
    });
    const included = await modelManager.sideloadDataFor({
      docs,
      throwOnMissingModel: false,
    });
    res.json({ data: docs, included, meta });
  }));

  /**
   * Retrieve one by ID.
   *
   * @todo handle include, exclude
   */
  router.get('/:id', asyncRoute(async (req, res) => {
    const { modelManager } = res.locals;
    const query = parseQuery(req.query, model);
    const doc = await modelManager.getQueryFor(restType).findById({
      fields: query.fields,
      id: req.params.id,
      withLinkUrls: false,
    });
    if (!doc) throw createError(404, 'No models found using the criteria provided.');
    const included = await modelManager.sideloadDataFor({
      docs: [doc],
      throwOnMissingModel: false,
    });
    res.json({ data: doc, included, meta });
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
