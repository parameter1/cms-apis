import { ApolloServer } from 'apollo-server-fastify';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import fastify from 'fastify';
import { CloseFastifyPlugin, OnShutdownPlugin } from './plugins/index.js';
import schema from './schema.js';

const isProduction = process.env.NODE_ENV === 'production';

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
      CloseFastifyPlugin(app),
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
