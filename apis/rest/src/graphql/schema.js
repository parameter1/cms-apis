import { makeExecutableSchema } from '@cms-apis/graphql/schema';
import {
  trimDirectiveTransformer,
} from './directives/index.js';
import resolvers from './resolvers/index.js';
import typeDefs from './type-defs/index.js';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const withTrim = trimDirectiveTransformer(schema);

export default withTrim;
