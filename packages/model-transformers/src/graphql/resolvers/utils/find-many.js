import { primeLoader } from '../../utils/index.js';

export default async function findMany({
  resource,
  after,
  limit,
  query,
  requiredFields = [],
  requiredQuery,
  prime = true,
} = {}, { dbs, loaders } = {}) {
  const hasLimit = limit && limit > 0;
  const ands = { query: [], count: [] };
  const and = (q, { count = true } = {}) => {
    ands.query.push(q);
    if (count) ands.count.push(q);
  };

  const required = requiredFields.reduce((o, path) => ({
    ...o, [path]: { $exists: true, $ne: null },
  }), {});

  if (Object.keys(required).length) and(required);
  if (requiredQuery) and(requiredQuery);
  if (query) and(query);
  if (after) and({ _id: { $gt: after } }, { count: false });

  const repo = dbs.legacy.repo(resource);
  const cursor = await repo.find({
    query: { ...(ands.query.length && { $and: ands.query }) },
    options: {
      sort: { _id: 1 },
      ...(hasLimit && { limit: limit + 1 }),
    },
  });
  const docs = await cursor.toArray();
  if (prime) primeLoader({ loader: loaders.get(resource), docs });

  const hasNextPage = hasLimit ? docs.length > limit : false;
  if (hasNextPage) docs.pop(); // remove the peeked record
  return {
    edges: () => docs.map((node) => ({
      node,
      cursor: node._id,
    })),
    pageInfo: {
      totalCount: () => repo.countDocuments({
        query: { ...(ands.count.length && { $and: ands.count }) },
      }),
      hasNextPage,
      endCursor: hasNextPage ? docs[docs.length - 1]._id : null,
    },
  };
}
