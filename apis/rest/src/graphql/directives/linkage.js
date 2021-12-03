/* eslint-disable no-param-reassign */
import { mapSchema, getDirective, MapperKind } from '@cms-apis/graphql/utils';
import createResolver from './linkage/create-resolver.js';
import getReturnType from '../utils/get-return-type.js';

export default function linkageDirectiveTransformer(schema, directiveName = 'linkage') {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName);
      const args = directive && directive[0] ? directive[0] : null;
      const { astNode } = fieldConfig;
      if (args && astNode) {
        const returnType = getReturnType(fieldConfig.type);
        if (!/^Link(One|Many)$/.test(returnType.name)) {
          throw new Error('Unexptected return type encountered. Expected a LinkOne or LinkMany object.');
        }
        const ref = returnType.name === 'LinkOne' ? 'ONE' : 'MANY';
        const field = args.field || astNode.name.value;
        if (!field) throw new Error('No target linkage field was provided.');
        const target = ref === 'ONE' ? `_edge.${field}` : `_connection.${field}`;
        const linkage = {
          ...args,
          field,
          target,
          ref,
        };
        astNode.$linkage = linkage;
        if (!fieldConfig.resolve) fieldConfig.resolve = createResolver(linkage);
      }
    },
  });
}
