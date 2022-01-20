import mongoose, { Schema } from 'mongoose';

export interface IRoomModel {
	roomId: string;
	memberCount: number;
	isPlaying: boolean;
}

const roomSchema = new Schema<IRoomModel>({
	roomId: { type: String, required: true },
	memberCount: { type: Number, min: 1, max: 8 },
	isPlaying: { type: Boolean, default: false },
});

export const RoomModel = mongoose.model<IRoomModel>('room', roomSchema);
