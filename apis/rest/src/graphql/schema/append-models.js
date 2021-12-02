/* eslint-disable no-param-reassign */
import { isObjectType } from 'graphql';
import getReturnType from '../utils/get-return-type.js';
import createModelMeta from '../../utils/create-model-meta.js';
import Model from './model.js';

export default (schema) => {
  const models = new Map();
  const types = schema.getTypeMap();

  Object.values(types).forEach((type) => {
    if (!isObjectType(type)) return;
    const { astNode } = type;
    if (!astNode || !astNode.$meta) return;

    const { $meta } = astNode;
    const { restType } = $meta;

    const attrs = new Map();
    const links = new Map();

    Object.values(type.getFields()).forEach((field) => {
      if (field.name === 'id') {
        // auto resolve id field
        field.resolve = (doc) => doc._id;
        return;
      }
      if (field.name === 'type') {
        // auto resolve type field
        field.resolve = () => restType;
        return;
      }
      if (field.name === 'links') {
        field.resolve = (doc) => doc;
        const linksType = schema.getType(getReturnType(field.type));
        Object.values(linksType.getFields()).forEach((f) => {
          if (f.name === 'self') {
            f.resolve = (doc, _, { linkBuilder }) => linkBuilder
              .self({ id: doc._id, restType });
            return;
          }
          links.set(f.name, {
            name: f.name,
            linkage: f.astNode.$linkage,
          });
        });
        return;
      }
      attrs.set(field.name, { name: field.name, type: `${getReturnType(field.type)}` });
    });

    models.set(restType, Model({
      ...$meta,
      path: `/${restType}`,
      meta: createModelMeta(restType),
      attrs,
      links,
      graphQLTypeObj: type,
    }));
  });

  schema.getModels = () => models;
  return schema;
};
