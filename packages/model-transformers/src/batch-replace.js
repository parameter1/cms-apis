import { divZero, getProfileMS, round } from '@cms-apis/utils';
import { EJSON } from 'bson';
import queryConnection from './query-connection.js';
import createReplaceOp from './create-replace-op.js';

const { log } = console;

export default async function batchReplace({
  graphql,
  operation,
  fragment,

  upsertTo,

  query,
  after,
  limit = 250,

  batchNum = 1,
} = {}) {
  const start = process.hrtime();
  log(`Running ${limit} node replacement batch #${batchNum} for ${operation}${after ? ` after cursor ${after}` : ''}${query ? ` using query ${EJSON.stringify(query)}` : ''}`);
  const { edges, pageInfo } = await queryConnection({
    graphql,
    operation,
    fragment,
    query,
    after,
    limit,
  });
  const { totalCount } = pageInfo;

  const operations = [];
  edges.forEach(({ node }) => {
    const op = createReplaceOp(node);
    operations.push(op);
  });
  if (operations.length) await upsertTo.bulkWrite({ operations });

  const pct = round(divZero(batchNum * limit, totalCount, 1) * 100, 3);
  log(`Batch #${batchNum} (~${pct}%) complete in ${round(getProfileMS(start))}ms\n`);
  if (pageInfo.hasNextPage) {
    await batchReplace({
      graphql,
      operation,
      fragment,

      upsertTo,

      query,
      after: pageInfo.endCursor,
      limit,

      batchNum: batchNum + 1,
    });
  }
}
