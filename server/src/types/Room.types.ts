import { IRoomModel } from '../models/room.model';

export type TRoom = Pick<IRoomModel, 'roomId' | 'memberCount' | 'isActive' | 'hasGameStarted' | 'maxMemberCount' | 'roomType'> & {
	id: string;
};
export type TJoinRoomArgs = Pick<TRoom, 'roomId'>;
