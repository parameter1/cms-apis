import { LegacyDB } from '@cms-apis/db';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  NewsletterCampaign: {
    async createdBy(campaign, _, { loaders }) {
      const userId = LegacyDB.extractRefId(campaign.createdBy);
      if (!userId) return null;
      const node = await loaders.get('platform.User').load(userId);
      return node ? { node } : null;
    },
    dates(campaign) {
      return {
        created: campaign.created,
        touched: campaign.touched,
        updated: campaign.updated,
        deployment: campaign.deploymentDate,
        scheduled: campaign.scheduled,
        html: campaign.htmlDate,
      };
    },
    list({ listId, listMessage, listStatus }) {
      return {
        identifier: listId,
        message: listMessage,
        status: listStatus,
      };
    },
    async newsletter(campaign, _, { loaders }) {
      const productId = LegacyDB.extractRefId(campaign.product);
      if (!productId) throw new Error(`Unable to load a product ID for campaign ID ${campaign._id}`);
      const node = await loaders.get('email.Newsletter').load(productId);
      return { node };
    },
  },

  /**
   *
   */
  Query: {
    async newsletterCampaignById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('email.Campaign').load(id);
    },

    async newsletterCampaigns(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'email.Campaign',
        after,
        limit,
        query,
      }, { dbs, loaders });
    },
  },
};
