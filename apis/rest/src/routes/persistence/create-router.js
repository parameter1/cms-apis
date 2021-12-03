import { Router } from 'express';
import createError from 'http-errors';
import sideloadDataFor from './sideload-data-for.js';
import asyncRoute from '../../utils/async-route.js';
import cleanNode from '../../utils/clean-node.js';
import parseQuery from '../../utils/parse-query.js';

export default ({ restType, modelManager } = {}) => {
  const model = modelManager.get(restType);
  if (!model) throw new Error(`Unable to find a model definition for ${restType}`);
  const router = Router();
  const meta = { model: model.getMeta() };

  /**
   * Retrive many.
   */
  router.get('/', asyncRoute(async (req, res) => {
    const { graphql } = res.locals;
    const params = parseQuery(req.query);
    const docs = await model.find({
      graphql,
      pagination: { limit: params.limit, skip: params.skip },
      withLinkUrls: false,
    });
    const included = await sideloadDataFor({
      graphql,
      docs,
      modelManager,
      throwOnMissingModel: false,
    });
    res.json({ data: docs.map(cleanNode), included, meta });
  }));

  /**
   * Retrieve one by ID.
   */
  router.get('/:id', asyncRoute(async (req, res) => {
    const { graphql } = res.locals;
    const doc = await model.findById({
      graphql,
      id: req.params.id,
      withLinkUrls: false,
    });
    if (!doc) throw createError(404, 'No models found using the criteria provided.');
    const included = await sideloadDataFor({
      graphql,
      docs: [doc],
      modelManager,
      throwOnMissingModel: false,
    });
    res.json({ data: cleanNode(doc), included, meta });
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
