import { makeExecutableSchema } from '@cms-apis/graphql/schema';
import { interfaceFieldsDirectiveTransformer } from '@cms-apis/graphql/directives';
import resolvers from './resolvers/index.js';
import typeDefs from './type-defs/index.js';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

// interface fields must be copied to each type _before_ applying projection
const withInterfaceFields = interfaceFieldsDirectiveTransformer(schema);

export default withInterfaceFields;
