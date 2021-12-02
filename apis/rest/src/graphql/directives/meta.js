/* eslint-disable no-param-reassign */
import { mapSchema, getDirective, MapperKind } from '@cms-apis/graphql/utils';

export default function metaDirectiveTransformer(schema, directiveName = 'meta') {
  return mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: (objConfig) => {
      const directive = getDirective(schema, objConfig, directiveName);
      const args = directive && directive[0] ? directive[0] : null;
      const { astNode } = objConfig;
      // console.log(objConfig, Object.keys(objConfig.getFields()));
      if (args && astNode) astNode.$meta = { ...args };
    },
  });
}
