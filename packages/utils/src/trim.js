export default (value, def = null) => {
  if (!value) return def;
  return `${value}`.trim() || def;
};
