import { makeExecutableSchema } from '@cms-apis/graphql/schema';
import resolvers from './resolvers/index.js';
import typeDefs from './type-defs/index.js';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

export default schema;
