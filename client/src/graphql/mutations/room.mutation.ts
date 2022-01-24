import { gql } from '@apollo/client';

export const CREATE_ROOM_MUTATION = gql`
	mutation createRoomMutation($maxMemberCount: Int!, $roomType: GameRoomEnum!) {
		createRoom(params: { maxMemberCount: $maxMemberCount, roomType: $roomType }) {
			id
			roomId
			memberCount
			maxMemberCount
			isActive
			hasGameStarted
			roomType
		}
	}
`;
