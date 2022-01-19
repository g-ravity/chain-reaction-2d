import { RoomModel } from '../models/room.model';

export type TRoom = Pick<RoomModel, 'roomId' | 'memberCount' | 'isPlaying'>;
export type TJoinRoomArgs = Pick<TRoom, 'roomId'>;
