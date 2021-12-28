import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import express from 'express';
import mongoose from 'mongoose';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';
import Redis, { RedisOptions } from 'ioredis';
import http from 'http';
import { GQLContext } from './types';
import resolvers from './graphql/resolvers';
import keys from './config/keys';

const app = express();

const schemaArray = loadFilesSync(path.join(__dirname, './graphql/schema/'));
const typeDefs = mergeTypeDefs(schemaArray);

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

const options: RedisOptions = {
	host: keys.redisHost,
	port: keys.redisPort,
	keyPrefix: keys.nodeEnv,
	password: keys.redisPassword,
	retryStrategy: (times: number) => {
		// reconnect after
		return Math.min(times * 50, 2000);
	},
};

const pubsub = new RedisPubSub({
	publisher: new Redis(options),
	subscriber: new Redis(options),
});

const server = new ApolloServer({
	schema,
	context: ({ req, res }): GQLContext => ({ req, res, pubsub }),
	introspection: true,
	playground: true,
});

server.applyMiddleware({ app, path: server.graphqlPath });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const dbConnectionString =
	keys.nodeEnv === 'production'
		? `mongodb+srv://${keys.dbUser}:${keys.dbPassword}@ravikcluster-aiykj.mongodb.net/chain-reaction?retryWrites=true&w=majority`
		: 'mongodb://localhost/chain-reaction_db';

mongoose.set('useFindAndModify', false);
mongoose
	.connect(dbConnectionString, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Connected to MongoDB');
		httpServer.listen({ port: keys.port }, () => {
			console.log(`🚀 Server ready at http://localhost:${keys.port}${server.graphqlPath}`);
		});
	})
	.catch(() => console.log('Error while connecting to MongoDB'));
