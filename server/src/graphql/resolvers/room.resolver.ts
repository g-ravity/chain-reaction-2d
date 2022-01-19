import { IRoom, JoinRoomArgs } from '../../types/Room.types';
import { GQLContext } from '../../types/General.types';
import { GAME_EVENTS } from '../../utils/constants';
import { cleanMongoObject, generateId } from '../../utils/commonHelpers';
import { Room } from '../../models/room.model';

export const createRoom = async (): Promise<void | IRoom> => {
	try {
		let roomExists = true;
		let roomId;
		while (roomExists) {
			roomId = generateId(6);
			const room = Room.findOne({ roomId });

			if (!room) roomExists = false;
		}

		const room = new Room({
			roomId,
			memberCount: 1,
			isPlaying: false,
		});

		if (!room) {
			throw new Error("Couldn't create room");
		}

		const roomDoc = await room.save();
		return cleanMongoObject(roomDoc);
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const getRooms = async (): Promise<IRoom[] | void> => {
	try {
		const rooms = await Room.find({ isPlaying: false, memberCount: { $gte: 1, $lte: 7 } });
		return rooms.map((room) => cleanMongoObject(room));
	} catch (err) {
		console.log(err);
		return null;
	}
};

export const joinRoom = async (_: any, args: JoinRoomArgs, { pubsub }: GQLContext): Promise<IRoom | void> => {
	try {
		const room = await Room.findOne({ roomId: args.roomId });

		if (!room) throw new Error('Room not found!');
		if (room.memberCount === 8) throw new Error('Sorry, room is full!');
		if (room.isPlaying) throw new Error('Game has already started. Cannot join room.');

		room.memberCount += 1;
		await room.save();

		pubsub.publish(GAME_EVENTS.PLAYER_JOINED, {
			playerJoined: cleanMongoObject(room),
		});

		return cleanMongoObject(room);
	} catch (err) {
		console.log(err);
		return null;
	}
};
