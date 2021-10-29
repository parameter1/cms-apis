import merge from 'lodash.merge';
import { GraphQLObjectID } from '@cms-apis/graphql/types';
import { ObjectId } from '@cms-apis/db';
import GraphQLEJSONObject from '../types/ejson-object.js';

import content from './content.js';
import website from './website.js';
import websiteSection from './website-section.js';
import websiteSectionOption from './website-section-option.js';

export default merge({
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
