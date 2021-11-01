import apolloClient from 'apollo-client';
import apolloCache from 'apollo-cache-inmemory';
import link from 'apollo-link-schema';
import gql from '@cms-apis/graphql/tag';
import { getAsArray } from '@cms-apis/object-path';
import schema from './schema.js';

const { ApolloClient } = apolloClient;
const { InMemoryCache, IntrospectionFragmentMatcher } = apolloCache;
const { SchemaLink } = link;

export default async ({ dbs, loaders } = {}) => {
  const tempClient = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: new SchemaLink({ schema }),
  });

  const { data } = await tempClient.query({
    query: gql`
      query {
        __schema {
          types {
            kind
            name
            possibleTypes { name }
          }
        }
      }
    `,
  });

  const types = getAsArray(data, '__schema.types').filter((type) => type.possibleTypes !== null);
  const introspectionQueryResultData = { __schema: { types } };
  const fragmentMatcher = new IntrospectionFragmentMatcher({ introspectionQueryResultData });

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
