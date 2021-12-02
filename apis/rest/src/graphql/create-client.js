import apolloClient from 'apollo-client';
import apolloCache from 'apollo-cache-inmemory';
import link from 'apollo-link-schema';
import createLinkBuilder from '../utils/create-link-builder.js';
import schema from './schema/index.js';

const { ApolloClient } = apolloClient;
const { InMemoryCache } = apolloCache;
const { SchemaLink } = link;

export default ({ db, req, tenant } = {}) => new ApolloClient({
  ssrMode: true,
  cache: new InMemoryCache(),
  link: new SchemaLink({
    schema,
    context: {
      db,
      req,
      constants: req.app.locals.constants,
      linkBuilder: createLinkBuilder({ req, tenant }),
      tenant,
    },
  }),
});
