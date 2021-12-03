import { get } from '@cms-apis/graphql/projection';
import getSelectedFieldMap from '../utils/get-selected-fields.js';

export default (info) => {
  const { selectionSet } = info.fieldNodes[0];
  const { schema, returnType, fragments } = info;

  // root model projection
  const root = get(schema, returnType, selectionSet, fragments);

  // get link projection, if set.
  const selections = getSelectedFieldMap({
    schema,
    returnType,
    fragments,
    selectionSet,
  });

  const links = selections.get('links');
  if (!links) return root;

  const linksSelectionsMap = links.selectionSet.selections.reduce((map, selection) => {
    map.set(selection.name.value, selection);
    return map;
  }, new Map());

  // only include links that have linkage selected.
  const linkSelections = [];
  links.selections.forEach((selection, fieldName) => {
    if (!selection.selections || !selection.selections.has('linkage')) return;
    const field = linksSelectionsMap.get(fieldName);
    if (field) linkSelections.push(field);
  });

  return {
    ...root,
    ...get(schema, links.field.type, { selections: linkSelections }, fragments),
  };
};
