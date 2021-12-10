/* eslint-disable no-param-reassign */
import { makeExecutableSchema } from '@cms-apis/graphql/schema';
import {
  arrayDirectiveTransformer,
  objectDirectiveTransformer,
  trimDirectiveTransformer,
  metaDirectiveTransformer,
  linkageDirectiveTransformer,
  queryDirectiveTransformer,
  projectDirectiveTransformer,
  statusDirectiveTransformer,
} from '../directives/index.js';
import resolvers from '../resolvers/index.js';
import typeDefs from '../type-defs/index.js';
import appendModelsToSchema from './append-models.js';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

// project must be first
const withProject = projectDirectiveTransformer(schema);

const withTrim = trimDirectiveTransformer(withProject);
const withArray = arrayDirectiveTransformer(withTrim);
const withObject = objectDirectiveTransformer(withArray);
const withMeta = metaDirectiveTransformer(withObject);
const withLinkage = linkageDirectiveTransformer(withMeta);
const withQuery = queryDirectiveTransformer(withLinkage);
const withStatus = statusDirectiveTransformer(withQuery);

export default appendModelsToSchema(withStatus);
