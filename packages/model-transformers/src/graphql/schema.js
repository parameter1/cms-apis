import { makeExecutableSchema } from '@cms-apis/graphql/schema';
import {
  formatDeletedDirectiveTransformer,
  formatStatusDirectiveTransformer,
  interfaceFieldsDirectiveTransformer,
  trimDirectiveTransformer,
} from './directives/index.js';
import resolvers from './resolvers/index.js';
import typeDefs from './type-defs/index.js';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

// interface fields must be copied to each type _before_ applying projection
const withInterfaceFields = interfaceFieldsDirectiveTransformer(schema);
const withTrim = trimDirectiveTransformer(withInterfaceFields);
const withFormatStatus = formatStatusDirectiveTransformer(withTrim);
const withFormatDeleted = formatDeletedDirectiveTransformer(withFormatStatus);

export default withFormatDeleted;
