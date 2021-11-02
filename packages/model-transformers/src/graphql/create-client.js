import apolloClient from 'apollo-client';
import apolloCache from 'apollo-cache-inmemory';
import link from 'apollo-link-schema';
import createFragmentMatcher from './create-fragment-matcher.js';
import schema from './schema.js';

const { ApolloClient } = apolloClient;
const { InMemoryCache } = apolloCache;
const { SchemaLink } = link;

export default async ({ dbs, loaders } = {}) => {
  const fragmentMatcher = await createFragmentMatcher({ schema });
  const defaults = {
    website: await dbs.legacy.repo('website.Site').findOne({ options: { strict: true } }),
  };
  defaults.websiteSection = await dbs.legacy.repo('website.Section').findOne({
    query: { alias: 'home', 'site.$id': defaults.website._id },
    options: { strict: true },
  });
  return new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache({ fragmentMatcher }),
    link: new SchemaLink({
      schema,
      context: { dbs, defaults, loaders },
    }),
  });
};
