import merge from 'lodash.merge';
import { GraphQLObjectID } from '@cms-apis/graphql/types';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ObjectId } from '@cms-apis/db';
import { GraphQLCursor, GraphQLDateTime, GraphQLEJSONObject } from '../types/index.js';

import content from './content.js';
import imageAsset from './image-asset.js';
import magazine from './magazine.js';
import magazineIssue from './magazine-issue.js';
import magazineSchedule from './magazine-schedule.js';
import magazineSection from './magazine-section.js';
import newsletter from './newsletter.js';
import newsletterCampaign from './newsletter-campaign.js';
import newsletterSchedule from './newsletter-schedule.js';
import newsletterSection from './newsletter-section.js';
import user from './user.js';
import website from './website.js';
import websiteInquirySubmission from './website-inquiry-submission.js';
import websiteRedirect from './website-redirect.js';
import websiteSchedule from './website-schedule.js';
import websiteScheduleOption from './website-schedule-option.js';
import websiteSection from './website-section.js';

export default merge(
  {
    Cursor: GraphQLCursor,
    DateTime: GraphQLDateTime,
    EJSONObject: GraphQLEJSONObject,
    JSONObject: GraphQLJSONObject,
    ObjectID: GraphQLObjectID(ObjectId),
    Query: {
      ping() {
        return 'pong';
      },
    },
    SyncInfo: {
      date() {
        return new Date();
      },
    },
  },
  content,
  imageAsset,
  magazine,
  magazineIssue,
  magazineSchedule,
  magazineSection,
  newsletter,
  newsletterCampaign,
  newsletterSchedule,
  newsletterSection,
  user,
  website,
  websiteInquirySubmission,
  websiteRedirect,
  websiteSchedule,
  websiteScheduleOption,
  websiteSection,
);
