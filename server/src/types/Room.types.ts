import { IRoomModel } from '../models/room.model';

export type TRoom = Pick<IRoomModel, 'roomId' | 'memberCount' | 'isPlaying'> & { id: string };
export type TJoinRoomArgs = Pick<TRoom, 'roomId'>;
