import { LegacyDB } from '@cms-apis/db';
import cleanNode from './clean-node.js';

export default (node) => {
  const filter = { _id: LegacyDB.coerceId(node._id) };
  const replacement = cleanNode(node);
  return { replaceOne: { filter, replacement, upsert: true } };
};
