import merge from 'lodash.merge';
import { GraphQLObjectID } from '@cms-apis/graphql/types';
import { ObjectId } from '@cms-apis/db';
import { GraphQLCursor, GraphQLEJSONObject } from '../types/index.js';

import content from './content.js';
import website from './website.js';
import websiteSection from './website-section.js';
import websiteSectionOption from './website-section-option.js';

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
}, content, website, websiteSection, websiteSectionOption);
