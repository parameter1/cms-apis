import { asArray, trim } from '@cms-apis/utils';
import { getAsObject } from '@cms-apis/object-path';
import findMany from './utils/find-many.js';

export default {
  /**
   *
   */
  WebsiteInquirySubmission: {
    _edge(submission, _, { loaders }) {
      return {
        async content() {
          const { contentId } = submission;
          if (!contentId) throw new Error(`Unable to load a content ID for submission ID ${submission._id}`);
          const node = await loaders.get('platform.Content').load(contentId);
          return { node };
        },
      };
    },
    _sync() {
      return {};
    },
    addresses(submission) {
      return getAsObject(submission, 'addresses');
    },
    async date({ created }) {
      return { created };
    },
    payload(submission) {
      return getAsObject(submission, 'payload');
    },
  },

  WebsiteInquirySubmissionAddresses: {
    bcc({ bcc }) {
      return asArray(bcc).map(trim).filter((v) => v);
    },
    cc({ cc }) {
      return asArray(cc).map(trim).filter((v) => v);
    },
    to({ to }) {
      return asArray(to).map(trim).filter((v) => v);
    },
  },

  /**
   *
   */
  Query: {
    async websiteInquirySubmissionById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('website.InquirySubmission').load(id);
    },

    async websiteInquirySubmissions(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'website.InquirySubmission',
        after,
        limit,
        query,
        prime: false,
      }, { dbs, loaders });
    },
  },
};
