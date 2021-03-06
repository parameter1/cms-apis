/* eslint-disable no-param-reassign */
import { isObjectType } from 'graphql';
import { get } from '@cms-apis/object-path';
import mapModelQueries from './map-model-queries.js';
import getReturnType from '../utils/get-return-type.js';
import Model from '../../model/index.js';

export default (schema) => {
  mapModelQueries(schema);

  const models = new Map();
  const types = schema.getTypeMap();

  Object.values(types).forEach((type) => {
    if (!isObjectType(type)) return;
    const { astNode } = type;
    if (!astNode || !astNode.$meta) return;

    const { $meta, $queryNames } = astNode;
    const { restType } = $meta;

    let idType;
    const attributes = new Map();
    const relationships = new Map();

    Object.values(type.getFields()).forEach((field) => {
      if (field.name === 'id') {
        // auto resolve id field
        idType = `${getReturnType(field.type)}`;
        field.resolve = (doc) => doc._id;
        return;
      }
      if (field.name === 'type') {
        // auto resolve type field
        field.resolve = (doc) => models.get(restType).getPolymorphicTypeFor(doc);
        return;
      }
      if (field.name === 'links') {
        field.resolve = (doc) => doc;
        const linksType = schema.getType(getReturnType(field.type));
        Object.values(linksType.getFields()).forEach((f) => {
          if (f.name === 'self') {
            f.resolve = (doc, _, { linkBuilder }) => linkBuilder
              .self({ id: doc._id, restType: models.get(restType).getPolymorphicTypeFor(doc) });
            return;
          }
          relationships.set(f.name, {
            name: f.name,
            linkage: f.astNode.$linkage,
          });
        });
        return;
      }
      attributes.set(field.name, {
        name: field.name,
        dbFieldName: get(field, 'astNode.$dbFieldName'),
        type: `${getReturnType(field.type)}`,
        fields: isObjectType(field.type) ? Object.values(field.type.getFields()) : [],
      });
    });

    models.set(restType, Model({
      idType,
      restType: $meta.restType,
      repoName: $meta.repoName,
      graphQLTypeObj: type,
      attributes,
      relationships,
      queryNames: $queryNames || new Map(),
    }));
  });

  schema.getModels = () => models;
  return schema;
};
