import { GQLContext } from '../../types/General.types';
import { GAME_EVENTS } from '../../utils/constants';

export const playerJoined = {
	subscribe: (_: unknown, __: unknown, { pubsub }: GQLContext): AsyncIterator<unknown, unknown, undefined> => {
		return pubsub.asyncIterator(GAME_EVENTS.PLAYER_JOINED);
	},
};
export const playerLeft = {
	subscribe: (_: unknown, __: unknown, { pubsub }: GQLContext): AsyncIterator<unknown, unknown, undefined> => {
		return pubsub.asyncIterator([GAME_EVENTS.PLAYER_LEFT]);
	},
};
export const gameStarted = {
	subscribe: (_: unknown, __: unknown, { pubsub }: GQLContext): AsyncIterator<unknown, unknown, undefined> => {
		return pubsub.asyncIterator([GAME_EVENTS.GAME_STARTED]);
	},
};
export const changeTurn = {
	subscribe: (_: unknown, __: unknown, { pubsub }: GQLContext): AsyncIterator<unknown, unknown, undefined> => {
		return pubsub.asyncIterator([GAME_EVENTS.CHANGE_TURN]);
	},
};
export const gameOver = {
	subscribe: (_: unknown, __: unknown, { pubsub }: GQLContext): AsyncIterator<unknown, unknown, undefined> => {
		return pubsub.asyncIterator([GAME_EVENTS.GAME_OVER]);
	},
};
