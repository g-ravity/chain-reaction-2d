import { IRoomModel } from '../models/room.model';

export type TRawRoom = Pick<IRoomModel, 'roomId' | 'memberCount' | 'isActive' | 'hasGameStarted' | 'maxMemberCount' | 'roomType'> & {
	_id: string;
};

export type TCleanRoom = Pick<IRoomModel, 'roomId' | 'memberCount' | 'isActive' | 'hasGameStarted' | 'maxMemberCount' | 'roomType'> & {
	id: string;
};
