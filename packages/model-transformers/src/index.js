import { immediatelyThrow } from '@cms-apis/utils';
import { mongoDB, legacyMongoDB } from './mongodb/clients.js';
import createDBs from './mongodb/create-dbs.js';
import createGraphQLClient from './graphql/create-client.js';
import createLoaders from './create-loaders.js';
// import transformContent from './transform/content.js';
import transformImageAssets from './transform/image-assets.js';
import transformNewsletters from './transform/newsletters.js';
import transformNewsletterSections from './transform/newsletter-sections.js';
import transformWebsiteRedirects from './transform/website-redirects.js';
import transformWebsiteScheduleOptions from './transform/website-schedule-options.js';
import transformWebsiteSections from './transform/website-sections.js';
import transformWebsites from './transform/websites.js';

const { log } = console;
process.on('unhandledRejection', immediatelyThrow);

(async () => {
  await Promise.all([
    (async () => {
      log('Connecting to MongoDB...');
      await mongoDB.connect();
      log(`MongoDB connected to ${mongoDB.url}`);
    })(),
    (async () => {
      log('Connecting to Legacy MongoDB...');
      await legacyMongoDB.connect();
      log(`Legacy MongoDB connected to ${legacyMongoDB.url}`);
    })(),
  ]);

  const tenant = 'acbm_fcp';
  const dbs = createDBs({ tenant });
  const loaders = createLoaders({
    legacyDB: dbs.legacy,
    // logger: log,
  });

  const graphql = createGraphQLClient({ dbs, loaders });

  await transformImageAssets({ dbs, graphql });
  await transformNewsletters({ dbs, graphql });
  await transformNewsletterSections({ dbs, graphql });
  await transformWebsites({ dbs, graphql });
  await transformWebsiteRedirects({ dbs, graphql });
  await transformWebsiteScheduleOptions({ dbs, graphql });
  await transformWebsiteSections({ dbs, graphql });

  log('Closing MongoDB clients...');
  await Promise.all([mongoDB.close(), legacyMongoDB.close()]);
  log('DONE!');
})().catch(immediatelyThrow);
