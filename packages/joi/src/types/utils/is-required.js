export default (helpers) => {
  const presence = helpers.schema.$_getFlag('presence');
  return presence === 'required';
};
