import { GQLContext } from '../../types';
import keys from '../../config/keys';

export const playerJoined = {
	subscribe: (_: any, __: any, { pubsub }: GQLContext) => pubsub.asyncIterator(keys.playerJoined),
};
export const playerLeft = {
	subscribe: (_: any, __: any, { pubsub }: GQLContext) => pubsub.asyncIterator([keys.playerLeft]),
};
export const gameStarted = {
	subscribe: (_: any, __: any, { pubsub }: GQLContext) => pubsub.asyncIterator([keys.gameStarted]),
};
export const changeTurn = {
	subscribe: (_: any, __: any, { pubsub }: GQLContext) => pubsub.asyncIterator([keys.changeTurn]),
};
export const gameOver = {
	subscribe: (_: any, __: any, { pubsub }: GQLContext) => pubsub.asyncIterator([keys.playerJoined]),
};
