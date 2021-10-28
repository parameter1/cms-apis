import apolloClient from 'apollo-client';
import apolloCache from 'apollo-cache-inmemory';
import link from 'apollo-link-schema';
import schema from './schema.js';

const { ApolloClient } = apolloClient;
const { InMemoryCache } = apolloCache;
const { SchemaLink } = link;

export default ({ dbs, loaders } = {}) => new ApolloClient({
  ssrMode: true,
  cache: new InMemoryCache(),
  link: new SchemaLink({
    schema,
    context: { dbs, loaders },
  }),
});