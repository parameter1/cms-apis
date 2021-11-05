import DataLoader from 'dataloader';
import { LegacyDB } from '@cms-apis/db';
import { isFunction as isFn } from '@cms-apis/utils';

const { warn } = console;

export default ({ legacyDB, logger } = {}) => {
  const loaders = new Map();
  legacyDB.namespaces.forEach((repos, namespace) => {
    loaders.set(namespace, new Map());
    repos.forEach((repo, name) => {
      loaders.get(namespace).set(name, new DataLoader(async (keys) => {
        if (isFn(logger)) logger('Loader keys:', { namespace, name, keys });
        const query = { _id: { $in: keys } };
        const cursor = await repo.find({ query });
        const docs = await cursor.toArray();
        const mapped = docs.reduce((map, doc) => {
          map.set(`${doc._id}`, doc);
          return map;
        }, new Map());
        return keys.map((key) => {
          const doc = mapped.get(`${key}`) || null;
          if (!doc) warn(`WARNING: No result for ${namespace}.${name} key ${key}`);
          return doc;
        });
      }, { cacheKeyFn: (key) => `${key}` }));
    });
  });

  const get = (key) => {
    const [namespace, model] = key.split('.');
    if (!namespace || !model) throw new Error('Invalid loader key. The key must contain a namespace and a model, e.g. `platform.Content`');
    const models = loaders.get(namespace);
    if (!models) throw new Error(`No loader namespace is registered for ${namespace}`);
    const loader = models.get(model);
    if (!loader) throw new Error(`No model loader for ${namespace}.${model}`);
    return loader;
  };

  const descendantTaxonomies = new DataLoader(async (parentIds) => {
    const query = { 'parent.$id': { $in: parentIds } };
    const cursor = await legacyDB.repo('platform.Taxonomy').find({ query });
    const children = await cursor.toArray();
    const mapped = children.reduce((map, child) => {
      const parentId = `${LegacyDB.extractRefId(child.parent)}`;
      if (!map.has(parentId)) map.set(parentId, []);
      get('platform.Taxonomy').prime(child._id, child);
      map.get(parentId).push(child);
      return map;
    }, new Map());
    return parentIds.map((parentId) => {
      const doc = mapped.get(`${parentId}`) || [];
      return doc;
    });
  });

  const descendantWebsiteSections = new DataLoader(async (parentIds) => {
    const query = { 'parent.$id': { $in: parentIds } };
    const cursor = await legacyDB.repo('website.Section').find({ query });
    const children = await cursor.toArray();
    const mapped = children.reduce((map, child) => {
      const parentId = `${LegacyDB.extractRefId(child.parent)}`;
      if (!map.has(parentId)) map.set(parentId, []);
      get('website.Section').prime(child._id, child);
      map.get(parentId).push(child);
      return map;
    }, new Map());
    return parentIds.map((parentId) => {
      const doc = mapped.get(`${parentId}`) || [];
      return doc;
    });
  });

  return { get, descendantTaxonomies, descendantWebsiteSections };
};
