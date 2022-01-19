import { ApolloServer } from 'apollo-server-express';
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
			onConnect() {
				// lookup userId by token, etc.
				// return { userId };
			},
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
			console.log('Connected to MongoDB');
			httpServer.listen({ port: +process.env.PORT }, () => {
				console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
			});
		})
		.catch(() => console.log('Error while connecting to MongoDB'));
})();
