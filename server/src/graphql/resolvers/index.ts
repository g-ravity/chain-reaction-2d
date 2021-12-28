import { playerJoined, playerLeft, gameStarted, changeTurn, gameOver } from './subscription.resolver';
import { createRoom, getRooms, joinRoom } from './room.resolver';

const Mutation = {
	// Room Mutations
	createRoom,
	joinRoom,
};

const Query = {
	// Room Queries
	getRooms,
};

const Subscription = {
	playerJoined,
	playerLeft,
	gameStarted,
	changeTurn,
	gameOver,
};

const resolvers = { Query, Mutation, Subscription };

export default resolvers;
