import { Router } from 'express';
import createError from 'http-errors';
import bodyParser from 'body-parser';
import asyncRoute from '../../utils/async-route.js';
import parseQuery from '../../utils/parse-query.js';

const { json } = bodyParser;

export default ({ model } = {}) => {
  const restType = model.getRestType();
  const router = Router({ mergeParams: true });
  const meta = { model: model.getMeta() };

  /**
   * Retrieve many.
   *
   */
  router.get('/', asyncRoute(async (req, res) => {
    const { subtype } = req.params;
    const { modelManager } = res.locals;
    const query = parseQuery(req.query, model);
    const docs = await modelManager.getQueryFor(restType).find({
      fields: query.fields,
      include: query.include,
      pagination: { limit: query.limit, skip: query.skip },
      sort: query.sort,
      ...(subtype && { subTypes: [subtype] }),
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
   */
  router.get('/:id', asyncRoute(async (req, res) => {
    const { subtype } = req.params;
    const { modelManager } = res.locals;
    const query = parseQuery(req.query, model);
    const doc = await modelManager.getQueryFor(restType).findById({
      fields: query.fields,
      include: query.include,
      id: req.params.id,
      ...(subtype && { subTypes: [subtype] }),
      withLinkUrls: false,
    });
    if (!doc) throw createError(404, 'No models found using the criteria provided.');
    const included = await modelManager.sideloadDataFor({
      docs: [doc],
      throwOnMissingModel: false,
    });
    res.json({ data: doc, included, meta });
  }));

  /**
   * Create one.
   */
  router.post('/', json(), (req, res) => {
    const { body } = req;
    if (!body.data) throw createError(400, 'The root request body must contain the "data" key.');
    const { data } = body;
    const { type } = data;
    if (!type) throw createError(400, 'Model data must contain the "type" key.');
    if (!model.isValidRestType(type)) throw createError(400, 'This endpoint does not support creation of this model type.');
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
