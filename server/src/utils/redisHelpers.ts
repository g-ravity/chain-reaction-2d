import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis, { RedisOptions } from 'ioredis';

const options: RedisOptions = {
	host: process.env.REDIS_HOST,
	port: +process.env.REDIS_PORT,
	keyPrefix: process.env.NODE_ENV,
	retryStrategy: (times: number) => {
		// reconnect after
		return Math.min(times * 50, 2000);
	},
};

export const pubsub = new RedisPubSub({
	publisher: new Redis(options),
	subscriber: new Redis(options),
});
