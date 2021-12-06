import merge from 'lodash.merge';
import { GraphQLObjectID, GraphQLBaseID } from '@cms-apis/graphql/types';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ObjectId } from '@cms-apis/db';
import GraphQLDateTime from '../types/date-time.js';

import imageAsset from './image-asset.js';
import website from './website.js';
import websiteSection from './website-section.js';

export default merge(
  {
    BaseID: GraphQLBaseID(ObjectId),
    DateTime: GraphQLDateTime,
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
  imageAsset,
  website,
  websiteSection,
);
