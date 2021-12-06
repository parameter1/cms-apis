import schema from '../graphql/schema/index.js';

const polymorphic = new Set();
schema.getModels().forEach((model) => {
  if (model.getIsPolymorphic()) polymorphic.add(model.getRestType());
});

export default polymorphic;
