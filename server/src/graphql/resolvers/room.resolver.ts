import { generateId, cleanMongoObject } from '../../utils';
import { Room } from '../../models';
import { IRoom, JoinRoomArgs } from '../../types/Room.types';
import { GQLContext } from '../../types';
import keys from '../../config/keys';

export const createRoom = async (): Promise<IRoom> => {
  try {
    let roomExists = true;
    let roomId;
    while (roomExists) {
      roomId = generateId(6);
      const room = await Room.findOne({ roomId });

      if (!room) roomExists = false;
    }

    const room = new Room({
      roomId,
      memberCount: 1,
      isPlaying: false
    });

    if (!room) {
      throw new Error("Couldn't create room");
    }

    const roomDoc = await room.save();
    return cleanMongoObject(roomDoc);
  } catch (err) {
    return err;
  }
};

export const getRooms = async (): Promise<IRoom[]> => {
  try {
    const rooms = await Room.find({ isPlaying: false, memberCount: { $gte: 1, $lte: 7 } });
    return rooms.map(room => cleanMongoObject(room));
  } catch (err) {
    return err;
  }
};

export const joinRoom = async (_: any, args: JoinRoomArgs, { pubsub }: GQLContext): Promise<IRoom> => {
  try {
    const room = await Room.findOne({ roomId: args.roomId });

    if (!room) throw new Error('Room not found!');
    if (room.memberCount === 8) throw new Error('Sorry, room is full!');
    if (room.isPlaying) throw new Error('Game has already started. Cannot join room.');

    room.memberCount = room.memberCount + 1;
    await room.save();

    pubsub.publish(keys.playerJoined, {
      playerJoined: cleanMongoObject(room)
    });

    return cleanMongoObject(room);
  } catch (err) {
    return err;
  }
};
