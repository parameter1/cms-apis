import DataLoader from 'dataloader';
import { LegacyDB } from '@cms-apis/db';
import { isFunction as isFn } from '@cms-apis/utils';

export default ({ db, logger } = {}) => {
  const loaders = new Map();
  db.repos.forEach((repo, name) => {
    loaders.set(name, new DataLoader(async (keys) => {
      const ids = keys.map((key) => LegacyDB.coerceId(key));
      if (isFn(logger)) logger('Loader keys:', { name, ids });
      const query = { _id: { $in: ids } };
      const cursor = await repo.find({ query });
      const docs = await cursor.toArray();
      const mapped = docs.reduce((map, doc) => {
        map.set(`${doc._id}`, doc);
        return map;
      }, new Map());
      return keys.map((key) => {
        const doc = mapped.get(`${key}`) || null;
        if (!doc) process.emitWarning(`WARNING: No result for ${name} using key ${key}`);
        return doc;
      });
    }));
  }, { cacheKeyFn: (key) => `${key}` });

  const get = (name) => {
    const loader = loaders.get(name);
    if (!loader) throw new Error(`No loader found for ${name}`);
    return loader;
  };

  return { get };
};
