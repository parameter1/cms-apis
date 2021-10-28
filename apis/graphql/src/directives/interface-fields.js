/* eslint-disable no-param-reassign */
import { mapSchema, MapperKind } from '@graphql-tools/utils';

export default function interfaceFieldsDirectiveTransformer(schema) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: (objConfig) => {
      const current = objConfig.getFields();
      objConfig.getInterfaces().forEach((iface) => {
        const fields = iface.getFields();
        Object.keys(fields).forEach((name) => {
          if (!current[name]) objConfig._fields[name] = fields[name];
        });
      });
    },
  });
}
