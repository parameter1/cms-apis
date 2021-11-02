import apolloClient from 'apollo-client';
import apolloCache from 'apollo-cache-inmemory';
import link from 'apollo-link-schema';
import gql from '@cms-apis/graphql/tag';
import { getAsArray } from '@cms-apis/object-path';

const { ApolloClient } = apolloClient;
const { InMemoryCache, IntrospectionFragmentMatcher } = apolloCache;
const { SchemaLink } = link;

export default async ({ schema }) => {
  const client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: new SchemaLink({ schema }),
  });

  const { data } = await client.query({
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
  return new IntrospectionFragmentMatcher({ introspectionQueryResultData });
};
