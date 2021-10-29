import { asArray } from '@cms-apis/utils';

export default (nodes) => asArray(nodes).sort((a, b) => {
  const idA = `${a._id}`;
  const idB = `${b._id}`;
  if (idA > idB) return 1;
  if (idA < idB) return -1;
  return 0;
});
