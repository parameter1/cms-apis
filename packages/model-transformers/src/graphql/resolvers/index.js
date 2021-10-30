import merge from 'lodash.merge';
import { GraphQLObjectID } from '@cms-apis/graphql/types';
import { ObjectId } from '@cms-apis/db';
import { GraphQLCursor, GraphQLEJSONObject } from '../types/index.js';

import content from './content.js';
import websiteOption from './website-option.js';
import websiteSection from './website-section.js';
import websiteSite from './website-site.js';

export default merge({
  Cursor: GraphQLCursor,
  EJSONObject: GraphQLEJSONObject,
  ObjectID: GraphQLObjectID(ObjectId),

  /**
   *
   */
  Query: {
    /**
     *
     */
    ping() {
      return 'pong';
    },
  },
}, content, websiteOption, websiteSection, websiteSite);
