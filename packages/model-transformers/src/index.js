import { immediatelyThrow } from '@cms-apis/utils';
import { mongoDB, legacyMongoDB } from './mongodb/clients.js';
import createDBs from './mongodb/create-dbs.js';
import createGraphQLClient from './graphql/create-client.js';
import createLoaders from './create-loaders.js';
// import transformContent from './transform/content.js';
// import transformWebsite from './transform/website.js';
import transformWebsiteSectionOption from './transform/website-section-option.js';

// import batch from './batch.js';
// import createReplaceOp from './create-replace-op.js';

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

  // await batch({
  //   repo: dbs.legacy.repo('website.Option'),
  //   limit: 1,
  // });

  // const transformed = await transformContent({ id: 21627001, graphql });
  // log(inspect(transformed, { colors: true, depth: 10 }));

  // const transformed = await transformWebsite({ id: '53ca8d671784f8066eb2c949', graphql });
  // log(inspect(transformed, { colors: true, depth: 10 }));

  await transformWebsiteSectionOption({ dbs, graphql });
  // log(inspect(transformed, { colors: true, depth: 10 }));

  // const op = createReplaceOp(transformed);
  // log(inspect(op, { colors: true, depth: 10 }));

  log('Closing MongoDB clients...');
  await Promise.all([mongoDB.close(), legacyMongoDB.close()]);
  log('DONE!');
})().catch(immediatelyThrow);
