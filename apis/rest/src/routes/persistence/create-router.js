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
   *
   * @todo handle include, exclude, and sort
   */
  router.get('/', asyncRoute(async (req, res) => {
    const { graphql } = res.locals;
    const query = parseQuery(req.query, model);
    const docs = await model.find({
      graphql,
      fields: query.fields,
      pagination: { limit: query.limit, skip: query.skip },
      sort: query.sort,
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
   *
   * @todo handle include, exclude
   */
  router.get('/:id', asyncRoute(async (req, res) => {
    const { graphql } = res.locals;
    const query = parseQuery(req.query, model);
    const doc = await model.findById({
      graphql,
      fields: query.fields,
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
