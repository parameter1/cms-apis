import { makeExecutableSchema } from '@cms-apis/graphql/schema';
import {
  arrayDirectiveTransformer,
  trimDirectiveTransformer,
  modelMetaDirectiveTransformer,
  linkageDirectiveTransformer,
} from './directives/index.js';
import resolvers from './resolvers/index.js';
import typeDefs from './type-defs/index.js';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const withTrim = trimDirectiveTransformer(schema);
const withArray = arrayDirectiveTransformer(withTrim);
const withModelMeta = modelMetaDirectiveTransformer(withArray);
const withLinkage = linkageDirectiveTransformer(withModelMeta);

export default withLinkage;
