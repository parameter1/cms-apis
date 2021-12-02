/* eslint-disable no-param-reassign */
import { mapSchema, getDirective, MapperKind } from '@cms-apis/graphql/utils';
import { trim } from '@cms-apis/utils';
import { get } from '@cms-apis/object-path';

export default function trimDirectiveTransformer(schema, directiveName = 'trim') {
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
            return trim(r, args.default);
          }
          return trim(get(obj, name), args.default);
        };
      }
    },
  });
}
