/* eslint-disable no-param-reassign */
import { mapSchema, getDirective, MapperKind } from '@cms-apis/graphql/utils';
import { getAsObject } from '@cms-apis/object-path';
import { asObject } from '@cms-apis/utils';

export default function objectDirectiveTransformer(schema, directiveName = 'object') {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName);
      const args = directive && directive[0] ? directive[0] : null;
      if (args) {
        const { astNode } = fieldConfig;
        const definedField = astNode ? astNode.name.value : null;
        const name = args.field || definedField;

        const { resolve: defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async (obj, ...rest) => {
          if (defaultFieldResolver) {
            const r = await defaultFieldResolver(obj, ...rest);
            return asObject(r);
          }
          return getAsObject(obj, name);
        };
      }
    },
  });
}
