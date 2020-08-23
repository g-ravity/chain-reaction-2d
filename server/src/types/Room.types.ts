import { RoomModel } from '../models';

export interface IRoom {
  roomId: RoomModel['roomId'];
  memberCount: RoomModel['memberCount'];
  isPlaying: RoomModel['isPlaying'];
}
