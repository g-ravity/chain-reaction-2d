import { generateId, cleanMongoObject } from '../../utils';
import { Room } from '../../models';
import { IRoom } from '../../types/Room.types';

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
