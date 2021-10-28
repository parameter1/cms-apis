import { ApolloServer } from 'apollo-server-fastify';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import fastify from 'fastify';
import {
  CloseFastifyPlugin,
  CorePlugin,
  OnShutdownPlugin,
  OperationProfilerPlugin,
} from './plugins/index.js';
import schema from './schema.js';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

export default async (options = {}) => {
  const app = fastify(options.fastify);
  const apollo = new ApolloServer({
    schema,
    introspection: true,
    debug: !isProduction,
    plugins: [
      isProduction
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
      OperationProfilerPlugin({ logToTerminal: isDevelopment }),
      CloseFastifyPlugin(app),
      CorePlugin(),
      ApolloServerPluginDrainHttpServer({
        httpServer: app.server,
        stopGracePeriodMillis: process.env.SHUTDOWN_GRACE_PERIOD,
      }),
      OnShutdownPlugin({ fn: options.onShutdown }),
    ],
  });

  await apollo.start();
  app.register(apollo.createHandler({
    path: '/',
    onHealthCheck: options.onHealthCheck,
  }));
  return app;
};
