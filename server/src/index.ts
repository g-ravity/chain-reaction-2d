import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { execute, subscribe } from 'graphql';
import express from 'express';
import mongoose from 'mongoose';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';
import http from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { config } from 'dotenv-safe';
import { GQLContext } from './types/General.types';
import resolvers from './graphql/resolvers';
import { logger } from './utils/logger';
import { pubsub } from './utils/redisHelpers';

config();

(async () => {
	const app = express();

	const schemaArray = loadFilesSync(path.join(__dirname, './graphql/schema/'));
	const typeDefs = mergeTypeDefs(schemaArray);

	const schema = makeExecutableSchema({
		typeDefs,
		resolvers,
	});

	const server = new ApolloServer({
		schema,
		context: ({ req, res }): GQLContext => ({ req, res, pubsub }),
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
