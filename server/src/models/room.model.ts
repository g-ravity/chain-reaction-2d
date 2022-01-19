import mongoose, { Document, Schema } from 'mongoose';

export interface RoomModel extends Document {
	roomId: string;
	memberCount: number;
	isPlaying: boolean;
}

const roomSchema: Schema = new Schema({
	roomId: { type: String, required: true },
	memberCount: { type: Number, min: 1, max: 8 },
	isPlaying: { type: Boolean, default: false },
});

export const Room = mongoose.model<RoomModel>('room', roomSchema);
