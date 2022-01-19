import { RoomModel } from '../models/room.model';

export interface IRoom {
	roomId: RoomModel['roomId'];
	memberCount: RoomModel['memberCount'];
	isPlaying: RoomModel['isPlaying'];
}

export interface JoinRoomArgs {
	roomId: IRoom['roomId'];
}
