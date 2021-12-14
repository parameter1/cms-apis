import { DB, ObjectId } from '@cms-apis/db';
import { get, set, getAsObject } from '@cms-apis/object-path';
import sortKeys from 'sort-keys';
import mapObject, { mapObjectSkip } from 'map-obj';
import is from '@sindresorhus/is';
import preparePathsToHash from './prepare-paths-to-hash.js';

const { keys } = Object;

export default (doc, paths = []) => {
  if (!doc) throw new Error('No document was provided');
  const toHash = preparePathsToHash(paths);

  const edges = getAsObject(doc, '_edge');

  const o = {
    _id: DB.coerceId(doc._id),
    _edge: keys(edges).reduce((obj, key) => {
      const edge = edges[key];
      if (!edge) return obj;
      // must have a node ID
      const nodeId = get(edge, 'node._id');
      if (!nodeId) return obj;
      delete edge.node;
      return {
        ...obj,
        [key]: { ...edge, _id: nodeId },
      };
    }, {}),
  };

  if (!o._id) throw new Error('Unable to extract a document _id value');
  toHash.forEach((path) => set(o, path, get(doc, path)));

  const mapped = mapObject(o, (key, value, source) => {
    if (value == null) return mapObjectSkip;
    if (is.date(value)) return [key, value.valueOf()];
    if (is.string(value) || is.number(value) || is.boolean(value)) return [key, value];
    if (is.array(value)) {
      if (!value.length) return mapObjectSkip;
      // filter null and undefined
      const filtered = value.filter((v) => v != null);
      if (!filtered.length) return mapObjectSkip;
      if (is.array(filtered, is.number)
        || is.array(filtered, is.string)
        || is.array(filtered, is.boolean)
      ) {
        return [key, filtered.sort()];
      }
      throw new Error('Sorting non-scalar or mixed typed arrays is not yet supported');
    }
    if (is.function(value.toString) && /^[a-f0-9]{24}$/.test(`${value}`)) return [key, `${value}`];
    if (is.plainObject(value)) {
      if (is.emptyObject(value)) return mapObjectSkip;
      return [key, value];
    }
    if (is.directInstanceOf(value, ObjectId)) return [key, `${value}`];
    const error = new Error(`Unsupported ${is(value)} type encountered for key ${key}`);
    error.key = key;
    error.value = value;
    error.source = source;
    throw error;
  }, { deep: true });

  // need to run map again to clear any empty objects that were created from dot access
  return sortKeys(mapObject(mapped, (key, value) => {
    if (is.emptyObject(value)) return mapObjectSkip;
    return [key, value];
  }, { deep: true }), { deep: true });
};
