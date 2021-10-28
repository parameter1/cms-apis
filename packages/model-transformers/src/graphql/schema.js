import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers/index.js';
import typeDefs from './type-defs/index.js';

export default makeExecutableSchema({
  resolvers,
  typeDefs,
});
