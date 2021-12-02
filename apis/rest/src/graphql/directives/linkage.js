/* eslint-disable no-param-reassign */
import { mapSchema, getDirective, MapperKind } from '@cms-apis/graphql/utils';
import createResolver from './linkage/create-resolver.js';

export default function linkageDirectiveTransformer(schema, directiveName = 'linkage') {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName);
      const args = directive && directive[0] ? directive[0] : null;
      const { astNode } = fieldConfig;
      if (args && astNode) {
        const linkage = { ...args, field: args.field || astNode.name.value };
        astNode.$linkage = linkage;
        if (!fieldConfig.resolve) fieldConfig.resolve = createResolver(linkage);
      }
    },
  });
}
