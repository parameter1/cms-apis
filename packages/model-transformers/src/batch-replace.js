import gql from '@cms-apis/graphql/tag';
import { extractFragmentData } from '@cms-apis/graphql/fragments';
import {
  divZero,
  getProfileMS,
  round,
  ucFirst,
} from '@cms-apis/utils';
import { EJSON } from 'bson';
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
  const { spreadFragmentName, processedFragment } = extractFragmentData(fragment);
  const QUERY = gql`
    query Transform${ucFirst(operation)}($input: PaginatedQueryInput = {}) {
      connection: ${operation}(input: $input) {
        edges {
          node {
            ${spreadFragmentName}
          }
        }
        pageInfo {
          totalCount
          hasNextPage
          endCursor
        }
      }
    }
    ${processedFragment}
  `;

  const input = { query, after, limit };
  const { data } = await graphql.query({ query: QUERY, variables: { input } });
  const { connection } = data;
  const { edges, pageInfo } = connection;
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
