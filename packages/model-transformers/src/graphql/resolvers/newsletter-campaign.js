import { LegacyDB } from '@cms-apis/db';
import { trim } from '@cms-apis/utils';
import { buildObjValues, findMany } from './utils/index.js';

export default {
  /**
   *
   */
  NewsletterCampaign: {
    _edge(campaign, _, { loaders }) {
      return {
        async createdBy() {
          const userId = LegacyDB.extractRefId(campaign.createdBy);
          if (!userId) return null;
          const node = await loaders.get('platform.User').load(userId);
          return node ? { node } : null;
        },
        async newsletter() {
          const productId = LegacyDB.extractRefId(campaign.product);
          if (!productId) throw new Error(`Unable to load a product ID for campaign ID ${campaign._id}`);
          const node = await loaders.get('email.Newsletter').load(productId);
          return { node };
        },
      };
    },
    date(campaign) {
      return {
        created: campaign.created,
        touched: campaign.touched,
        updated: campaign.updated,
        deployed: campaign.deploymentDate,
        scheduled: campaign.scheduled,
        htmlUpdated: campaign.htmlDate,
      };
    },
    isLocked({ locked }) {
      return Boolean(locked);
    },
    list({ listId, listMessage, listStatus }) {
      return buildObjValues([
        ['identifier', trim(listId)],
        ['message', trim(listMessage)],
        ['status', trim(listStatus)],
      ]);
    },
    name({ name, fromName }) {
      return { default: trim(name), from: trim(fromName) };
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
