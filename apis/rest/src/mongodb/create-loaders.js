import DataLoader from 'dataloader';
import { LegacyDB } from '@cms-apis/db';
import { isFunction as isFn } from '@cms-apis/utils';

export default ({ db, logger } = {}) => {
  const loaders = new Map();
  db.repos.forEach((repo, name) => {
    loaders.set(name, new DataLoader(async (keys) => {
      if (isFn(logger)) logger('Loader keys:', { name, keys });
      const ids = keys.map((key) => LegacyDB.coerceId(key));
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
};
