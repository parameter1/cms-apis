import { get, getAsArray } from '@cms-apis/object-path';
import extractParentFrom from './extract-parent-from.js';
import filters from './filters.js';

export default ({
  restType,
  target,
  empty,
  ref,
}) => async (doc, _, { linkBuilder }, info) => {
  const parent = extractParentFrom(info);
  const links = linkBuilder.linkage({
    id: doc._id,
    restType: parent.$meta.restType,
    field: info.fieldName,
  });

  if (empty) return { linkage: ref === 'ONE' ? null : [], ...links };
  if (ref === 'ONE') {
    const id = get(doc, `${target}.node._id`);
    return { linkage: id ? { id, type: restType } : null, ...links };
  }
  const filter = get(filters, `${parent.name.value}.${info.fieldName}`, () => true);
  return {
    linkage: getAsArray(doc, target)
      .filter((edge) => edge && edge.node && edge.node._id && filter(edge))
      .map((edge) => edge.node._id)
      .sort()
      .map((id) => ({ id, type: restType })),
    ...links,
  };
};
