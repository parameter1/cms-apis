import merge from 'lodash.merge';
import { GraphQLObjectID } from '@cms-apis/graphql/types';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ObjectId } from '@cms-apis/db';
import { GraphQLCursor, GraphQLEJSONObject } from '../types/index.js';

import content from './content.js';
import imageAsset from './image-asset.js';
import newsletter from './newsletter.js';
import newsletterSection from './newsletter-section.js';
import website from './website.js';
import websiteRedirect from './website-redirect.js';
import websiteSection from './website-section.js';
import websiteScheduleOption from './website-schedule-option.js';

export default merge(
  {
    Cursor: GraphQLCursor,
    EJSONObject: GraphQLEJSONObject,
    JSONObject: GraphQLJSONObject,
    ObjectID: GraphQLObjectID(ObjectId),
    Query: {
      ping() {
        return 'pong';
      },
    },
  },
  content,
  imageAsset,
  newsletter,
  newsletterSection,
  website,
  websiteRedirect,
  websiteScheduleOption,
  websiteSection,
);
