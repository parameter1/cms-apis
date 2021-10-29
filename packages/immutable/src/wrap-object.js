import { fromJS, List, Map } from 'immutable';
import { inspect } from 'util';

export default (obj) => {
  const map = fromJS(obj);
  /**
   *
   * @param {string} path
   * @returns {*|Map|List}
   */
  const get = (path) => map.getIn(path.split('.'));
  return {
    inspect: (options) => inspect(obj, { colors: true, depth: 5, ...options }),
    map,
    get,

    /**
     * @param {string} path
     * @returns {List}
     */
    getAsList: (path) => {
      const v = get(path);
      if (v instanceof List) return v;
      return List();
    },

    /**
     * @param {string} path
     * @returns {Map}
     */
    getAsMap: (path) => {
      const v = get(path);
      if (v instanceof Map) return v;
      return Map();
    },
  };
};
