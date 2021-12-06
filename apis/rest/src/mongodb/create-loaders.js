import MongoDBRepoLoader from '@cms-apis/dataloader';
import { LegacyDB } from '@cms-apis/db';
import schema from '../graphql/schema/index.js';

const models = new Map();
schema.getModels().forEach((model) => {
  models.set(model.getRepoName(), model);
});

export default ({ db, logger } = {}) => {
  const loaders = new Map();
  db.repos.forEach((repo, name) => {
    const model = models.get(name);
    loaders.set(name, new MongoDBRepoLoader({
      name,
      repo,
      logger,
      coercionFn: LegacyDB.coerceId,
      ...(model && model.getIsPolymorphic() && {
        criteria: { _type: { $in: [...model.getSubTypes()] } },
      }),
    }));
  });

  const get = (name) => {
    const loader = loaders.get(name);
    if (!loader) throw new Error(`No loader found for ${name}`);
    return loader;
  };

  return { get };
};
