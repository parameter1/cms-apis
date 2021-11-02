import { set } from '@cms-apis/object-path';

export default (values) => {
  if (values.every(([, value]) => value == null)) return null;
  return values.reduce((o, [path, value]) => {
    set(o, path, value);
    return o;
  }, {});
};
