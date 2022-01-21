import mongoose, { Schema } from 'mongoose';

export interface IRoomModel {
	roomId: string;
	memberCount: number;
	maxMemberCount: number;
	isActive: boolean;
	roomType: 'PRIVATE' | 'PUBLIC';
	hasGameStarted: boolean;
}

const roomSchema = new Schema<IRoomModel>({
	roomId: { type: String, required: true },
	memberCount: { type: Number, min: 0, max: 8, required: true, default: 0 },
	maxMemberCount: { type: Number, min: 2, max: 8, required: true },
	isActive: { type: Boolean, required: true, default: true },
	hasGameStarted: { type: Boolean, required: true, default: false },
	roomType: { type: String, enum: ['PRIVATE', 'PUBLIC'], required: true, default: 'PUBLIC' },
});

export const RoomModel = mongoose.model<IRoomModel>('room', roomSchema);
