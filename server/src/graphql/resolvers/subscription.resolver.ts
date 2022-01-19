import { GQLContext } from '../../types/General.types';
import { GAME_EVENTS } from '../../utils/constants';

export const playerJoined = {
	subscribe: (_: any, __: any, { pubsub }: GQLContext) => pubsub.asyncIterator(GAME_EVENTS.PLAYER_JOINED),
};
export const playerLeft = {
	subscribe: (_: any, __: any, { pubsub }: GQLContext) => pubsub.asyncIterator([GAME_EVENTS.PLAYER_LEFT]),
};
export const gameStarted = {
	subscribe: (_: any, __: any, { pubsub }: GQLContext) => pubsub.asyncIterator([GAME_EVENTS.GAME_STARTED]),
};
export const changeTurn = {
	subscribe: (_: any, __: any, { pubsub }: GQLContext) => pubsub.asyncIterator([GAME_EVENTS.CHANGE_TURN]),
};
export const gameOver = {
	subscribe: (_: any, __: any, { pubsub }: GQLContext) => pubsub.asyncIterator([GAME_EVENTS.GAME_OVER]),
};
