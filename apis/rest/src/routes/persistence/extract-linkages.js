import { get, getAsObject } from '@cms-apis/object-path';

export default (docs = []) => docs.reduce((map, doc) => {
  const add = (linkage) => {
    if (!linkage) return;
    const { type, id } = linkage;
    if (!type || !id) return;
    if (!map.has(type)) map.set(type, new Set());
    map.get(type).add(id);
  };
  const links = getAsObject(doc, 'links');
  Object.keys(links).forEach((key) => {
    const linkage = get(links[key], 'linkage');
    if (!linkage) return;
    if (Array.isArray(linkage)) {
      linkage.forEach(add);
    } else {
      add(linkage);
    }
  });
  return map;
}, new Map());
