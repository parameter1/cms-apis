import schema from '../graphql/schema/index.js';
import Query from './query/index.js';
import extractLinkages from './utils/extract-linkages.js';

const models = schema.getModels();

export default ({ graphql } = {}) => {
  const queries = new Map();
  models.forEach((model, restType) => {
    queries.set(restType, Query({ model, graphql }));
  });

  const getMetadataFor = (restType) => models.get(restType);
  const getQueryFor = (restType) => queries.get(restType);

  const sideloadDataFor = async ({ docs = [], throwOnMissingModel = true }) => {
    const sideloaded = [];
    const linkages = extractLinkages(docs);
    if (!linkages.size) return sideloaded;
    await Promise.all(Array.from(linkages).map(async ([restType, ids]) => {
      const model = models.get(restType);
      if (!model) {
        const message = `Unable to load model for ${restType}`;
        if (throwOnMissingModel) throw new Error(message);
        process.emitWarning(message);
        return;
      }
      const related = await getQueryFor(model.getRestType())
        .loadMany({ graphql, ids, withLinkage: false });
      sideloaded.push(...related);
    }));
    return sideloaded;
  };

  return {
    getMetadataFor,
    getQueryFor,
    sideloadDataFor,
  };
};
