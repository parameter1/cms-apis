import DataLoader from 'dataloader';
import { isFunction as isFn } from '@cms-apis/utils';

export default ({ legacyDB, logger } = {}) => {
  const loaders = new Map();
  legacyDB.namespaces.forEach((repos, namespace) => {
    loaders.set(namespace, new Map());
    repos.forEach((repo, name) => {
      loaders.get(namespace).set(name, new DataLoader(async (keys) => {
        if (isFn(logger)) logger({ namespace, name, keys });
        const query = { _id: { $in: keys } };
        const cursor = await repo.find({ query });
        const docs = await cursor.toArray();
        const mapped = docs.reduce((map, doc) => {
          map.set(`${doc._id}`, doc);
          return map;
        }, new Map());
        return keys.map((key) => {
          const doc = mapped.get(`${key}`);
          if (!doc) throw new Error(`No result for ${namespace}.${name} key ${key}`);
          return doc;
        });
      }));
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
  return { get };
};
