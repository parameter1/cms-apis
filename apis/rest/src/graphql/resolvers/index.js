import merge from 'lodash.merge';
import { GraphQLObjectID } from '@cms-apis/graphql/types';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ObjectId } from '@cms-apis/db';

import websiteSection from './website-section.js';

export default merge(
  {
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
  websiteSection,
);
