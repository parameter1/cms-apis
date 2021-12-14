const { isArray } = Array;

/**
 * Prepares the document fields paths that can be used in a hash.
 * Root level underscore fields are removed (except for `_type`) as the hashing
 * function will handle this on their own.
 *
 * @param {string[]} paths The field, dot-notated paths to hash
 * @returns {Set}
 */
export default (paths = []) => {
  if (!isArray(paths) && !(paths instanceof Set)) {
    throw new Error('The document field paths to hash must either be an array or a set.');
  }
  const toHash = new Set();
  paths.forEach((path) => {
    if (path === '_type') {
      toHash.add(path);
      return;
    }
    if (/^_/.test(path)) return;
    toHash.add(path);
  });
  return toHash;
};
