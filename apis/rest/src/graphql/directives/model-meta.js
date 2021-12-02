/* eslint-disable no-param-reassign */
import { mapSchema, getDirective, MapperKind } from '@cms-apis/graphql/utils';

export default function modelMetaDirectiveTransformer(schema, directiveName = 'modelMeta') {
  return mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: (objConfig) => {
      const directive = getDirective(schema, objConfig, directiveName);
      const args = directive && directive[0] ? directive[0] : null;
      const { astNode } = objConfig;
      if (args && astNode) {
        astNode.$modelMeta = {
          type: args.type,
        };
      }
    },
  });
}
