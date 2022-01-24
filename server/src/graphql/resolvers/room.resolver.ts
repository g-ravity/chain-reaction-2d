import * as yup from 'yup';
import { TCleanRoom, TRawRoom } from '../../types/Room.types';
import { GQLContext } from '../../types/General.types';
import { GAME_EVENTS } from '../../utils/constants';
import { cleanMongoObject, generateId, MongoIdType, omitWrapper } from '../../utils/commonHelpers';
import { IRoomModel, RoomModel } from '../../models/room.model';
import { logger } from '../../utils/logger';
import { validateInput } from '../../utils/validateInput';
import { findOneAndUpdateQuery, findOneQuery, findQuery, saveQuery } from '../../utils/generalQueries';

/**
 * Types
 */
type TCreateRoomArgs = Pick<TCleanRoom, 'maxMemberCount' | 'roomType'>;

type TGetRoomsArgs = Pick<TCleanRoom, 'roomType' | 'hasGameStarted'> & {
	isRoomFull?: boolean;
};

type TJoinRoomArgs = Pick<TCleanRoom, 'roomId'>;

/**
 * Validation Schemas
 */
export const CreateRoomSchema: yup.SchemaOf<TCreateRoomArgs> = yup.object({
	maxMemberCount: yup.number().required(),
	roomType: yup.mixed().oneOf(['PUBLIC', 'PRIVATE']).required(),
});

export const GetRoomsSchema: yup.SchemaOf<TGetRoomsArgs> = yup.object({
	roomType: yup.mixed().oneOf(['PUBLIC', 'PRIVATE']).required(),
	hasGameStarted: yup.boolean().required(),
	isRoomFull: yup.boolean(),
});

export const JoinRoomSchema: yup.SchemaOf<TJoinRoomArgs> = yup.object({
	roomId: yup.string().required(),
});

/**
 * Route Handlers
 */
export const createRoom = async (_: unknown, { params }: { params: TCreateRoomArgs }): Promise<TCleanRoom | unknown> => {
	try {
		validateInput(CreateRoomSchema, params);

		const room = new RoomModel({
			maxMemberCount: params.maxMemberCount,
			roomType: params.roomType,
			roomId: generateId({ length: 6 }),
		} as Pick<IRoomModel, 'maxMemberCount' | 'roomId'>);

		const roomDoc = await saveQuery(room);

		if (!roomDoc) {
			throw new Error("Couldn't create room");
		}

		return cleanMongoObject(roomDoc) as TCleanRoom;
	} catch (err) {
		logger.error('Error creating room: ', err);
		return err;
	}
};

export const getRooms = async (_: unknown, { params }: { params: TGetRoomsArgs }): Promise<TCleanRoom[] | unknown> => {
	try {
		validateInput(GetRoomsSchema, params);

		const rooms = await findQuery<IRoomModel>(RoomModel, {
			isActive: true,
			...omitWrapper(params, ['isRoomFull']),
			...(params.isRoomFull
				? { $expr: { $eq: ['$maxMemberCount', '$memberCount'] } }
				: { $expr: { $lt: ['$memberCount', '$maxMemberCount'] } }),
		});

		return rooms.map((room) => cleanMongoObject(room) as TCleanRoom);
	} catch (err) {
		logger.error('Error while fetching rooms: ', err);
		return err;
	}
};

export const joinRoom = async (
	_: unknown,
	{ params }: { params: TJoinRoomArgs },
	{ pubsub }: GQLContext,
): Promise<TCleanRoom | unknown> => {
	try {
		validateInput(JoinRoomSchema, params);

		const room = (await findOneQuery<IRoomModel>(RoomModel, { roomId: params.roomId })) as TRawRoom;

		if (!room) throw new Error('Room not found!');
		if (room.memberCount === room.maxMemberCount) throw new Error('Sorry, room is full!');
		if (room.hasGameStarted || !room.isActive) throw new Error('Sorry, cannot join this room.');

		const updatedRoom = new RoomModel({
			...omitWrapper(room, ['id']),
			memberCount: room.memberCount + 1,
		});

		const updatedRoomDoc = await findOneAndUpdateQuery<IRoomModel>(RoomModel, { _id: MongoIdType(room._id) }, updatedRoom, {
			new: true,
		});

		pubsub.publish(GAME_EVENTS.PLAYER_JOINED, {
			playerJoined: { roomId: room.roomId, room: cleanMongoObject(updatedRoomDoc) },
		});

		return cleanMongoObject(updatedRoomDoc) as TCleanRoom;
	} catch (err) {
		logger.error('Error while joining room: ', err);
		return err;
	}
};
