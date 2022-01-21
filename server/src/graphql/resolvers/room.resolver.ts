import * as yup from 'yup';
import { TRoom, TJoinRoomArgs } from '../../types/Room.types';
import { GQLContext } from '../../types/General.types';
import { GAME_EVENTS } from '../../utils/constants';
import { cleanMongoObject, generateId } from '../../utils/commonHelpers';
import { IRoomModel, RoomModel } from '../../models/room.model';
import { logger } from '../../utils/logger';
import { validateInput } from '../../utils/validateInput';
import { saveQuery } from '../../utils/generalQueries';

/**
 * Types
 */
type TCreateRoomArgs = {
	maxMemberCount: number;
};

/**
 * Validation Schemas
 */
export const CreateRoomSchema: yup.SchemaOf<TCreateRoomArgs> = yup.object({
	maxMemberCount: yup.number().required(),
});

/**
 * Route Handlers
 */
export const createRoom = async (_: unknown, { params }: { params: TCreateRoomArgs }): Promise<TRoom | unknown> => {
	try {
		validateInput(CreateRoomSchema, params);

		const room = new RoomModel({
			maxMemberCount: params.maxMemberCount,
			roomId: generateId({ length: 6 }),
		} as Pick<IRoomModel, 'maxMemberCount' | 'roomId'>);

		const roomDoc = await saveQuery(room);

		if (!roomDoc) {
			throw new Error("Couldn't create room");
		}

		return cleanMongoObject(roomDoc) as TRoom;
	} catch (err) {
		logger.error('Error creating room: ', err);
		return err;
	}
};

export const getRooms = async (): Promise<TRoom[] | unknown> => {
	try {
		const rooms = await RoomModel.find({ isPlaying: false, memberCount: { $gte: 1, $lte: 7 } });

		return rooms.map((room) => cleanMongoObject(room as any) as TRoom);
	} catch (err) {
		logger.error('Error while fetching rooms: ', err);
		return err;
	}
};

export const joinRoom = async (_: unknown, args: TJoinRoomArgs, { pubsub }: GQLContext): Promise<TRoom | unknown> => {
	try {
		const room = await RoomModel.findOne({ roomId: args.roomId });

		if (!room) throw new Error('Room not found!');
		if (room.memberCount === 8) throw new Error('Sorry, room is full!');
		if (room.isActive) throw new Error('Game has already started. Cannot join room.');

		room.memberCount += 1;
		await room.save();

		pubsub.publish(GAME_EVENTS.PLAYER_JOINED, {
			playerJoined: cleanMongoObject(room as any),
		});

		return cleanMongoObject(room as any) as TRoom;
	} catch (err) {
		logger.error('Error while joining room: ', err);
		return err;
	}
};
