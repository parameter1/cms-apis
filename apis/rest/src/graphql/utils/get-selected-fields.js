import { isObject } from '@cms-apis/utils';
import getReturnType from './get-return-type.js';

export default function getSelectedFieldMap({
  schema,
  returnType,
  fragments,
  selectionSet,
} = {}, map = new Map()) {
  const resolvedType = getReturnType(returnType);
  if (!isObject(selectionSet)) return map;
  const { selections = [] } = selectionSet;

  selections.forEach((selection) => {
    const { kind, name, typeCondition } = selection;

    if (kind === 'Field') {
      const field = resolvedType.getFields()[name.value];
      map.set(name.value, {
        owningType: resolvedType,
        field,
        selections: selection.selectionSet ? getSelectedFieldMap({
          schema,
          returnType: field.type,
          fragments,
          selectionSet: selection.selectionSet,
        }, new Map()) : undefined,
        selectionSet: selection.selectionSet,
      });
      return;
    }

    if (kind === 'FragmentSpread') {
      getSelectedFieldMap({
        schema,
        returnType: schema.getType(fragments[name.value].typeCondition.name.value),
        fragments,
        selectionSet: fragments[name.value].selectionSet,
      }, map);
      return;
    }
    if (kind === 'InlineFragment') {
      getSelectedFieldMap({
        schema,
        returnType: schema.getType(typeCondition.name.value),
        fragments,
        selectionSet: selection.selectionSet,
      }, map);
      return;
    }
    throw new Error(`Unknown kind ${kind} encountered.`);
  });
  return map;
}
