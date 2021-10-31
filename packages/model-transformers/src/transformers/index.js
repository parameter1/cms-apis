import operations from './operations.js';
import batchReplace from '../batch-replace.js';

export default class Transformers {
  constructor({ dbs, graphql } = {}) {
    this.dbs = dbs;
    this.graphql = graphql;
  }

  async replace({
    operation,
    after,
    limit,
    query,
  } = {}) {
    const settings = operations.get(operation);
    if (!settings) throw new Error(`No transform operation was found for ${operation}`);

    return batchReplace({
      graphql: this.graphql,
      operation,
      upsertTo: this.dbs.main.repo(settings.collection),
      after,
      limit,
      query,
      fragment: settings.fragment,
    });
  }
}
