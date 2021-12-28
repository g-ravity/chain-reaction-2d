import { Response, Request } from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export interface Keys {
	port: string | number;
	dbUser: string;
	dbPassword: string;
	nodeEnv: string;
	redisPort: number;
	redisHost: string;
	redisPassword: string;
	playerJoined: string;
	playerLeft: string;
	gameStarted: string;
	changeTurn: string;
	gameOver: string;
}

export interface GQLContext {
	req: Request;
	res: Response;
	pubsub: RedisPubSub;
}
