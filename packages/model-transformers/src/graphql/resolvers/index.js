import merge from 'lodash.merge';
import { GraphQLObjectID } from '@cms-apis/graphql/types';
import { ObjectId } from '@cms-apis/db';

import content from './content.js';
import website from './website.js';
import websiteSection from './website-section.js';

export default merge({
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
}, content, website, websiteSection);
