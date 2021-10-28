import { makeExecutableSchema } from '@cms-apis/graphql/schema';
import resolvers from './resolvers/index.js';
import typeDefs from './type-defs/index.js';

export default makeExecutableSchema({
  resolvers,
  typeDefs,
});
