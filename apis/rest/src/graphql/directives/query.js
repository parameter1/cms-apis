/* eslint-disable no-param-reassign */
import { mapSchema, getDirective, MapperKind } from '@cms-apis/graphql/utils';
import getReturnType from '../utils/get-return-type.js';

export default function queryDirectiveTransformer(schema, directiveName = 'query') {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName);
      const args = directive && directive[0] ? directive[0] : null;
      const { astNode } = fieldConfig;
      if (args && astNode) {
        const returnType = getReturnType(fieldConfig.type);
        astNode.$query = { kind: args.kind, returnType: `${returnType}` };
      }
    },
  });
}
