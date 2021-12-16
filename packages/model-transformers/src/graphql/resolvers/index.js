import merge from 'lodash.merge';
import { GraphQLObjectID } from '@cms-apis/graphql/types';
import { GraphQLJSONObject } from 'graphql-type-json';
import { ObjectId, LegacyDB } from '@cms-apis/db';
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
import taxonomy from './taxonomy.js';
import user from './user.js';
import website from './website.js';
import websiteInquirySubmission from './website-inquiry-submission.js';
import websiteRedirect from './website-redirect.js';
import websiteSchedule from './website-schedule.js';
import websiteScheduleOption from './website-schedule-option.js';
import websiteSection from './website-section.js';

const buildMetaFields = async (doc, { defaults, loaders }) => {
  const created = {};
  const updated = {};

  let createdByUser;
  if (doc.createdBy) {
    const userId = LegacyDB.extractRefId(doc.createdBy);
    if (userId) createdByUser = await loaders.get('platform.User').load(userId);
  }

  let updatedByUser;
  if (doc.updatedBy) {
    const userId = LegacyDB.extractRefId(doc.updatedBy);
    if (userId) updatedByUser = await loaders.get('platform.User').load(userId);
  }

  if (createdByUser) created.by = createdByUser;
  if (updatedByUser) updated.by = updatedByUser;
  if (!updatedByUser && createdByUser) updated.by = createdByUser;

  if (doc.created) created.date = doc.created;
  if (doc.updated) updated.date = doc.updated;

  if (!created.date) {
    created.date = typeof doc._id === 'object' ? doc._id.getTimestamp() : defaults.oldestCreatedDate;
  }
  if (!updated.date) updated.date = created.date;
  return { created, updated };
};

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
    UnderscoreFieldsInterface: {
      _meta(doc, _, { defaults, loaders }) {
        return buildMetaFields(doc, { defaults, loaders });
      },
      _sync() {
        return {};
      },
      async _version(doc, _, { defaults, loaders }) {
        const meta = await buildMetaFields(doc, { defaults, loaders });
        return { n: 1, history: [meta.updated] };
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
  taxonomy,
  user,
  website,
  websiteInquirySubmission,
  websiteRedirect,
  websiteSchedule,
  websiteScheduleOption,
  websiteSection,
);
