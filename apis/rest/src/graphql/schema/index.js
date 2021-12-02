/* eslint-disable no-param-reassign */
import { makeExecutableSchema } from '@cms-apis/graphql/schema';
import {
  arrayDirectiveTransformer,
  trimDirectiveTransformer,
  metaDirectiveTransformer,
  linkageDirectiveTransformer,
} from '../directives/index.js';
import resolvers from '../resolvers/index.js';
import typeDefs from '../type-defs/index.js';
import appendModelsToSchema from './append-models.js';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const withTrim = trimDirectiveTransformer(schema);
const withArray = arrayDirectiveTransformer(withTrim);
const withMeta = metaDirectiveTransformer(withArray);
const withLinkage = linkageDirectiveTransformer(withMeta);

export default appendModelsToSchema(withLinkage);
