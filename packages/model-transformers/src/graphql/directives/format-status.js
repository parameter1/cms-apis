/* eslint-disable no-param-reassign */
import { mapSchema, getDirective, MapperKind } from '@cms-apis/graphql/utils';
import { get } from '@cms-apis/object-path';
import { formatStatus } from '../utils/index.js';

export default function formatStatusDirectiveTransformer(schema, directiveName = 'formatStatus') {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName);
      const args = directive && directive[0] ? directive[0] : null;
      if (args) {
        const { astNode } = fieldConfig;
        const definedField = astNode ? astNode.name.value : null;
        const name = args.field || definedField;
        if (!fieldConfig.resolve) fieldConfig.resolve = (obj) => formatStatus(get(obj, name));
      }
    },
  });
}
