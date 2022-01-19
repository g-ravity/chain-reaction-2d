import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { execute, subscribe } from 'graphql';
import express from 'express';
import mongoose from 'mongoose';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';
import Redis, { RedisOptions } from 'ioredis';
import http from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { config } from 'dotenv-safe';
import { GQLContext } from './types/General.types';
import resolvers from './graphql/resolvers';
import { logger } from './utils/logger';

config();

(async () => {
	const app = express();

	const schemaArray = loadFilesSync(path.join(__dirname, './graphql/schema/'));
	const typeDefs = mergeTypeDefs(schemaArray);

	const schema = makeExecutableSchema({
		typeDefs,
		resolvers,
	});

	const options: RedisOptions = {
		host: process.env.REDIS_HOST,
		port: +process.env.REDIS_PORT,
		keyPrefix: process.env.NODE_ENV,
		retryStrategy: (times: number) => {
			// reconnect after
			return Math.min(times * 50, 2000);
		},
	};

	const pubSub = new RedisPubSub({
		publisher: new Redis(options),
		subscriber: new Redis(options),
	});

	const server = new ApolloServer({
		schema,
		context: ({ req, res }): GQLContext => ({ req, res, pubsub: pubSub }),
		introspection: true,
		plugins: [
			ApolloServerPluginLandingPageGraphQLPlayground({}),
			{
				async serverWillStart() {
					return {
						async drainServer() {
							subscriptionServer.close();
						},
					};
				},
			},
		],
	});

	const httpServer = http.createServer(app);

	const subscriptionServer = SubscriptionServer.create(
		{
			schema,
			execute,
			subscribe,
			/*
      TODO: return data from here that will be passed
      as context to subscription resolvers
      */
			onConnect() {},
		},
		{
			server: httpServer,
			path: server.graphqlPath,
		},
	);

	await server.start();

	server.applyMiddleware({ app });

	mongoose
		.connect(process.env.DB_URI)
		.then(() => {
			logger.log('Connected to MongoDB');
			httpServer.listen({ port: +process.env.PORT }, () => {
				logger.log(`🚀 Server running on PORT ${process.env.PORT}`);
			});
		})
		.catch((error) => logger.error('Error while connecting to MongoDB: ', error));
})();
