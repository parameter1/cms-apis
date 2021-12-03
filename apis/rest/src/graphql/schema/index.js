/* eslint-disable no-param-reassign */
import { makeExecutableSchema } from '@cms-apis/graphql/schema';
import {
  arrayDirectiveTransformer,
  objectDirectiveTransformer,
  trimDirectiveTransformer,
  metaDirectiveTransformer,
  linkageDirectiveTransformer,
  queryDirectiveTransformer,
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
const withObject = objectDirectiveTransformer(withArray);
const withMeta = metaDirectiveTransformer(withObject);
const withLinkage = linkageDirectiveTransformer(withMeta);
const withQuery = queryDirectiveTransformer(withLinkage);

export default appendModelsToSchema(withQuery);
