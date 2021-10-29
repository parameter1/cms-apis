export default (status) => {
  const value = parseInt(status, 10);
  if (value === 0) return 0;
  return value || null;
};
