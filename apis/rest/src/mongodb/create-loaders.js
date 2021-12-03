import MongoDBRepoLoader from '@cms-apis/dataloader';
import { LegacyDB } from '@cms-apis/db';

export default ({ db, logger } = {}) => {
  const loaders = new Map();
  db.repos.forEach((repo, name) => {
    loaders.set(name, new MongoDBRepoLoader({
      name,
      repo,
      logger,
      coercionFn: LegacyDB.coerceId,
    }));
  });

  const get = (name) => {
    const loader = loaders.get(name);
    if (!loader) throw new Error(`No loader found for ${name}`);
    return loader;
  };

  return { get };
};
