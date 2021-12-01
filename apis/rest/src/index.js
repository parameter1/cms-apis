import { immediatelyThrow } from '@cms-apis/utils';
import bootService from '@parameter1/terminus/boot-service.js';
import terminusUtils from '@parameter1/terminus/utils.js';
import createServer from './create-server.js';
import {
  EXPOSED_HOST,
  EXPOSED_PORT,
  HOST,
  PORT,
} from './env.js';
import mongodb from './mongodb/client.js';
import pkg from '../package.js';

const { log } = terminusUtils;

process.on('unhandledRejection', immediatelyThrow);

bootService({
  name: pkg.name,
  version: pkg.version,
  server: createServer(),
  host: HOST,
  exposedHost: EXPOSED_HOST,
  port: PORT,
  exposedPort: EXPOSED_PORT,
  onStart: async () => {
    log('Connecting to MongoDB...');
    await mongodb.connect();
    log(`MongoDB connected to ${mongodb.url}`);
  },
  onSignal: async () => {
    log('Closing MongoDB...');
    await mongodb.close();
    log('MongoDB closed.');
  },
  onHealthCheck: () => mongodb.ping({ id: pkg.name }).then(() => 'db okay'),
}).catch(immediatelyThrow);
