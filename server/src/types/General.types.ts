import { Response, Request } from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export interface GQLContext {
	req: Request;
	res: Response;
	pubsub: RedisPubSub;
}
