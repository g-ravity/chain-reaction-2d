export type TRoom = {
	id: string;
	roomId: string;
	memberCount: number;
	maxMemberCount: number;
	isActive: boolean;
	roomType: 'PRIVATE' | 'PUBLIC';
	hasGameStarted: boolean;
};
