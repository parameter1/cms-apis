import { get, getAsArray } from '@cms-apis/object-path';
import extractParentFrom from './extract-parent-from.js';
import filters from './filters.js';

export default ({
  type,
  field,
  ref,
  empty,
}) => async (doc, _, { linkBuilder }, info) => {
  if (!field) throw new Error('No target linkage field was provided.');
  const parent = extractParentFrom(info);
  const links = linkBuilder.linkage({
    id: doc._id,
    type: parent.$modelMeta.type,
    field: info.fieldName,
  });

  if (empty) return { linkage: ref === 'ONE' ? null : [], ...links };
  const target = ref === 'ONE' ? `_edge.${field}` : `_connection.${field}`;
  if (ref === 'ONE') {
    const id = get(doc, `${target}.node._id`);
    return { linkage: id ? { id, type } : null, ...links };
  }
  const filter = get(filters, `${parent.name.value}.${info.fieldName}`, () => true);
  return {
    linkage: getAsArray(doc, target)
      .filter((edge) => edge && edge.node && edge.node._id && filter(edge))
      .map((edge) => edge.node._id)
      .sort()
      .map((id) => ({ id, type })),
    ...links,
  };
};
