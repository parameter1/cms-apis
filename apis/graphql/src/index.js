import { immediatelyThrow } from '@cms-apis/utils';
import createServer from './create-server.js';
import {
  EXPOSED_HOST,
  EXPOSED_PORT,
  HOST,
  PORT,
} from './env.js';
import legacyMongo from './mongodb/legacy-client.js';
import pkg from '../package.js';

const { log } = console;
process.on('unhandledRejection', immediatelyThrow);

(async () => {
  log(`Booting ${pkg.name} v${pkg.version}...`);
  // start services here
  log('Connecting to Legacy MongoDB...');
  await legacyMongo.connect();
  log(`Legacy MongoDB connected to ${legacyMongo.url}`);

  const server = await createServer({
    fastify: {
      trustProxy: ['loopback', 'linklocal', 'uniquelocal'],
    },
    onHealthCheck: async () => {
      await legacyMongo.ping({ id: pkg.name });
      return true;
    },
    onShutdown: async () => {
      // stop services here
      log('Closing MongoDB instances...');
      await legacyMongo.close();
      log('MongoDB instances closed.');
    },
  });

  await server.listen({ host: HOST, port: PORT });
  log(`Ready on http://${EXPOSED_HOST}:${EXPOSED_PORT}`);
})().catch(immediatelyThrow);
