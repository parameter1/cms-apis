import { asArray } from '@cms-apis/utils';
import { get } from '@cms-apis/object-path';
import { ObjectId } from '@cms-apis/db';

const getValue = (o, path) => {
  const value = get(o, path);
  return value instanceof ObjectId ? `${value}` : value;
};

export default (nodes, path) => asArray(nodes).sort((a, b) => {
  const valueA = getValue(a, path);
  const valueB = getValue(b, path);

  if (valueA > valueB) return 1;
  if (valueA < valueB) return -1;
  return 0;
});
