import { get } from '@cms-apis/graphql/projection';
import escapeRegex from 'escape-string-regexp';
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

  const projectKeys = new Set(Object.keys({
    ...root,
    ...get(schema, links.field.type, { selections: linkSelections }, fragments),
  }));

  // clear the "most-specific" project keys
  projectKeys.forEach((key) => {
    const pattern = new RegExp(`^${escapeRegex(key)}`);
    projectKeys.forEach((toTest) => {
      if (key === toTest) return;
      if (pattern.test(toTest)) projectKeys.delete(toTest);
    });
  });
  const projection = {};
  projectKeys.forEach((key) => { projection[key] = 1; });
  return projection;
};
