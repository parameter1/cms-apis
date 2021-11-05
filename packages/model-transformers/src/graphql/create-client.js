import apolloClient from 'apollo-client';
import apolloCache from 'apollo-cache-inmemory';
import link from 'apollo-link-schema';
import { LegacyDB } from '@cms-apis/db';
import { isFunction as isFn } from '@cms-apis/utils';
import createFragmentMatcher from './create-fragment-matcher.js';
import schema from './schema.js';

const { ApolloClient } = apolloClient;
const { InMemoryCache } = apolloCache;
const { SchemaLink } = link;

export default async ({ dbs, loaders } = {}) => {
  const [fragmentMatcher, website] = await Promise.all([
    createFragmentMatcher({ schema }),
    dbs.legacy.repo('website.Site').findOne({ options: { strict: true } }),
  ]);
  const defaults = {
    website,
    websiteSection: await dbs.legacy.repo('website.Section').findOne({
      query: { alias: 'home', 'site.$id': website._id, status: 1 },
      options: { strict: true },
    }),
  };

  const loadRefOneFrom = async (doc, {
    model,
    path,
    required = false,
    needs = false,
    defaultValue = null,
  } = {}) => {
    const refId = LegacyDB.extractRefIdFromPath(doc, path);
    if (!refId) {
      if (required) throw new Error(`Unable to extract a ${model} reference ID.`);
      return defaultValue;
    }
    const node = await loaders.get(model).load(refId);
    const valid = Boolean(node) && (isFn(needs) ? Boolean(node) && needs(node) : true);
    if (required && !valid) throw new Error(`Unable to load a ${model} reference document.`);
    return valid ? node : defaultValue;
  };

  return new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache({ fragmentMatcher }),
    link: new SchemaLink({
      schema,
      context: {
        dbs,
        defaults,
        loaders,
        loadRefOneFrom,
      },
    }),
  });
};
