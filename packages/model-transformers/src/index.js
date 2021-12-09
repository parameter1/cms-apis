import { immediatelyThrow } from '@cms-apis/utils';
import { mongoDB, legacyMongoDB } from './mongodb/clients.js';
import createDBs from './mongodb/create-dbs.js';
import createGraphQLClient from './graphql/create-client.js';
import createLoaders from './create-loaders.js';
import Transformers from './transformers/index.js';

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

  if (process.env.NODE_ENV === 'development') {
    log('Creating MongoDB indexes...');
    await dbs.main.createIndexes();
    log('Indexes created.');
  }

  const loaders = createLoaders({
    legacyDB: dbs.legacy,
    // logger: log,
  });

  const graphql = await createGraphQLClient({ dbs, loaders });

  const transformers = new Transformers({ dbs, graphql });
  await transformers.replace({ operation: 'allContent' });
  await transformers.replace({ operation: 'imageAssets' });
  await transformers.replace({ operation: 'magazines' });
  await transformers.replace({ operation: 'magazineIssues' });
  await transformers.replace({ operation: 'magazineSchedules' });
  await transformers.replace({ operation: 'magazineSections' });
  await transformers.replace({ operation: 'newsletters' });
  await transformers.replace({ operation: 'newsletterCampaigns' });
  await transformers.replace({ operation: 'newsletterSchedules' });
  await transformers.replace({ operation: 'newsletterSections' });
  await transformers.replace({ operation: 'taxonomies' });
  await transformers.replace({ operation: 'users' });
  await transformers.replace({ operation: 'websites' });
  await transformers.replace({ operation: 'websiteSections' });
  await transformers.replace({ operation: 'websiteScheduleOptions' });
  await transformers.replace({ operation: 'websiteSchedules' });
  await transformers.replace({ operation: 'websiteRedirects' });
  await transformers.replace({ operation: 'websiteInquirySubmissions' });

  log('Closing MongoDB clients...');
  await Promise.all([mongoDB.close(), legacyMongoDB.close()]);
  log('DONE!');
})().catch(immediatelyThrow);
