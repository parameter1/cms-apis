import WebsiteSection from './website-section.js';

export default [
  WebsiteSection(),
].reduce((map, model) => {
  map.set(model.getEmberType(), model);
  return map;
}, new Map());
