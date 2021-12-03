import extractLinkages from './extract-linkages.js';
import cleanNode from '../../utils/clean-node.js';

export default async ({
  graphql,
  docs = [],
  modelManager,
  throwOnMissingModel = true,
} = {}) => {
  const sideloaded = [];
  const linkages = extractLinkages(docs);
  if (!linkages.size) return sideloaded;
  await Promise.all(Array.from(linkages).map(async ([restType, ids]) => {
    const model = modelManager.get(restType);
    if (!model) {
      const message = `Unable to load model for ${restType}`;
      if (throwOnMissingModel) throw new Error(message);
      process.emitWarning(message);
      return;
    }
    const related = await model.loadMany({ graphql, ids, withLinkage: false });
    sideloaded.push(...related.map(cleanNode));
  }));
  return sideloaded;
};
