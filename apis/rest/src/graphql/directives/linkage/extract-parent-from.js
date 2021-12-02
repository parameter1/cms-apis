import { isObjectType } from 'graphql';

const pattern = /Links$/;

export default (info) => {
  const parentType = info.parentType.toString();
  if (!pattern.test(parentType)) {
    throw new Error(`Expected parent type to be a Links object. Found ${parentType} instead`);
  }
  const cleaned = parentType.replace(pattern, '');
  const parent = info.schema.getType(cleaned);
  if (!parent || !isObjectType(parent)) {
    throw new Error(`Unable to find a schema type for ${cleaned}`);
  }
  const { astNode: parentNode } = parent;
  if (!parentNode || !parentNode.$meta) {
    throw new Error(`Unable to extract model metadata for ${parent}`);
  }
  return parentNode;
};
