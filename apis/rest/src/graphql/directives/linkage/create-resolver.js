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
  const { $meta } = parent;

  const models = info.schema.getModels();
  const model = models.get($meta.restType);

  const links = linkBuilder.linkage({
    id: doc._id,
    restType: model.getPolymorphicTypeFor(doc),
    field: info.fieldName,
  });
  if (empty) return { linkage: ref === 'ONE' ? null : [], ...links };

  const relatedModel = models.get(restType);
  if (!relatedModel) throw new Error(`Cannot find related linkage model for ${restType}`);

  const filter = (edge) => {
    // exclude status enabled models when status is zero
    const fn = get(filters, `${parent.name.value}.${info.fieldName}`, () => true);
    return fn(edge);
  };

  if (ref === 'ONE') {
    const edge = get(doc, target);
    if (!edge) return { linkage: null, ...links };
    const id = get(doc, `${target}.node._id`);
    if (!id) return { linkage: null, ...links };
    const filtered = filter(edge);
    const node = get(doc, `${target}.node`);
    const polymorphicType = relatedModel.getPolymorphicTypeFor(node);
    return {
      linkage: filtered ? { id, type: polymorphicType } : null,
      ...links,
    };
  }
  return {
    linkage: getAsArray(doc, target)
      .filter((edge) => edge && edge.node && edge.node._id && filter(edge))
      .map((edge) => edge.node)
      .sort((a, b) => {
        const idA = `${a._id}`;
        const idB = `${b._id}`;
        if (idA > idB) return 1;
        if (idA < idB) return -1;
        return 0;
      })
      .map((node) => {
        const polymorphicType = relatedModel.getPolymorphicTypeFor(node);
        return { id: node._id, type: polymorphicType };
      }),
    ...links,
  };
};
