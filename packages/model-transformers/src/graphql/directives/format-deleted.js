/* eslint-disable no-param-reassign */
import { mapSchema, getDirective, MapperKind } from '@cms-apis/graphql/utils';
import { formatStatus } from '../utils/index.js';

export default function formatStatusDirectiveTransformer(schema, directiveName = 'formatDeleted') {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const directive = getDirective(schema, fieldConfig, directiveName);
      const args = directive && directive[0] ? directive[0] : null;
      if (args) {
        if (!fieldConfig.resolve) {
          fieldConfig.resolve = (obj) => {
            const status = formatStatus(obj.status);
            if (status === null) return null;
            return status === 0;
          };
        }
      }
    },
  });
}
