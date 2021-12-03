import merge from 'lodash.merge';
import { GraphQLObjectID, GraphQLBaseID } from '@cms-apis/graphql/types';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ObjectId } from '@cms-apis/db';

import website from './website.js';
import websiteSection from './website-section.js';

export default merge(
  {
    BaseID: GraphQLBaseID(ObjectId),
    JSONObject: GraphQLJSONObject,
    ObjectID: GraphQLObjectID(ObjectId),
    Mutation: {
      ping() {
        return 'pong';
      },
    },
    Query: {
      ping() {
        return 'pong';
      },
    },
  },
  website,
  websiteSection,
);
