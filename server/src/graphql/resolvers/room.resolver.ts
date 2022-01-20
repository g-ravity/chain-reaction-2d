import { TRoom, TJoinRoomArgs } from '../../types/Room.types';
import { GQLContext } from '../../types/General.types';
import { GAME_EVENTS } from '../../utils/constants';
import { cleanMongoObject, generateId } from '../../utils/commonHelpers';
import { IRoomModel, RoomModel } from '../../models/room.model';
import { logger } from '../../utils/logger';

export const createRoom = async (): Promise<void | TRoom> => {
	try {
		const roomDoc = await RoomModel.create({
			isPlaying: false,
			memberCount: 0,
			roomId: generateId({ length: 6 }),
		} as IRoomModel);

		if (!roomDoc) {
			throw new Error("Couldn't create room");
		}

		return cleanMongoObject(roomDoc) as TRoom;
	} catch (err) {
		logger.error('Error creating room: ', err);
		return null;
	}
};

export const getRooms = async (): Promise<TRoom[] | void> => {
	try {
		const rooms = await RoomModel.find({ isPlaying: false, memberCount: { $gte: 1, $lte: 7 } });

		return rooms.map((room) => cleanMongoObject(room) as TRoom);
	} catch (err) {
		logger.error('Error while fetching rooms: ', err);
		return null;
	}
};

export const joinRoom = async (_: unknown, args: TJoinRoomArgs, { pubsub }: GQLContext): Promise<TRoom | void> => {
	try {
		const room = await RoomModel.findOne({ roomId: args.roomId });

		if (!room) throw new Error('Room not found!');
		if (room.memberCount === 8) throw new Error('Sorry, room is full!');
		if (room.isPlaying) throw new Error('Game has already started. Cannot join room.');

		room.memberCount += 1;
		await room.save();

		pubsub.publish(GAME_EVENTS.PLAYER_JOINED, {
			playerJoined: cleanMongoObject(room),
		});

		return cleanMongoObject(room) as TRoom;
	} catch (err) {
		logger.error('Error while joining room: ', err);
		return null;
	}
};
