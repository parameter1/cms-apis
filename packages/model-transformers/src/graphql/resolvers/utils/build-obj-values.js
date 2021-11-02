export default (values) => {
  if (values.every(([, value]) => value == null)) return null;
  return values.reduce((o, [key, value]) => ({ ...o, [key]: value }), {});
};
