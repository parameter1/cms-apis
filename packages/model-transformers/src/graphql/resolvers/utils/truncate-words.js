export default ({ value, length = 155, suffix = '...' } = {}) => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const replaced = trimmed.replace(/\s+/g, ' ');
  const parts = replaced.split(' ').map((v) => v.trim()).filter((v) => v);

  let currentLength = 0;
  const toJoin = [];
  parts.some((part) => {
    if (currentLength >= length) return true;
    currentLength += part.length;
    toJoin.push(part);
    return false;
  });
  const str = toJoin.join(' ');
  if (suffix && str.length < replaced.length) return `${str}${suffix}`;
  return str;
};
