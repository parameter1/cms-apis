import { get, getAsObject } from '@cms-apis/object-path';
import polymorphic from '../polymorphic.js';

export default (docs = []) => docs.reduce((map, doc) => {
  const add = (linkage) => {
    if (!linkage) return;
    const { type, id } = linkage;
    if (!type || !id) return;

    let rootType = type;
    polymorphic.forEach((root) => {
      if (type.startsWith(root)) rootType = root;
    });

    if (!map.has(rootType)) map.set(rootType, new Set());
    map.get(rootType).add(id);
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
