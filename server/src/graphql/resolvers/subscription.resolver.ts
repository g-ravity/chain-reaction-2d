import { withFilter } from 'graphql-subscriptions';
import { pubsub } from '../../utils/redisHelpers';
import { GAME_EVENTS } from '../../utils/constants';

export const playerJoined = {
	subscribe: withFilter(
		() => pubsub.asyncIterator(GAME_EVENTS.PLAYER_JOINED),
		(payload, { params }) => {
			return payload.playerJoined.roomId === params.roomId;
		},
	),
};

export const playerLeft = {
	subscribe: (_: unknown, __: unknown): AsyncIterator<unknown, unknown, undefined> => {
		return pubsub.asyncIterator([GAME_EVENTS.PLAYER_LEFT]);
	},
};

export const gameStarted = {
	subscribe: (_: unknown, __: unknown): AsyncIterator<unknown, unknown, undefined> => {
		return pubsub.asyncIterator([GAME_EVENTS.GAME_STARTED]);
	},
};

export const changeTurn = {
	subscribe: (_: unknown, __: unknown): AsyncIterator<unknown, unknown, undefined> => {
		return pubsub.asyncIterator([GAME_EVENTS.CHANGE_TURN]);
	},
};

export const gameOver = {
	subscribe: (_: unknown, __: unknown): AsyncIterator<unknown, unknown, undefined> => {
		return pubsub.asyncIterator([GAME_EVENTS.GAME_OVER]);
	},
};
