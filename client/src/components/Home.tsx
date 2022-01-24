import { FetchResult, MutationFunctionOptions, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { CREATE_ROOM_MUTATION } from '../graphql/mutations/room.mutation';
import Button from '../reusableComponents/Button';
import RadioButton from '../reusableComponents/RadioButton';
import { TRoom } from '../types/Room';
import { isNotEmptyObject } from '../utils/commonHelpers';

/**
 * Types
 */
type TFormType = 'JOIN_ROOM' | 'CREATE_ROOM';
type TFormState = Pick<TRoom, 'roomType' | 'roomId' | 'maxMemberCount'>;
type ICreateRoomData = {
	createRoom: TRoom;
};
type ICreateRoomVars = Pick<TRoom, 'maxMemberCount' | 'roomType'>;
type TFormAction = {
	createRoom: {
		isLoading: boolean;
		callback: (options?: MutationFunctionOptions<ICreateRoomData, ICreateRoomVars>) => Promise<FetchResult<ICreateRoomData>>;
	};
};

/**
 * Components
 */
const SideLayout = ({
	formType,
	setFormType,
	onFormAction,
}: {
	formType: TFormType;
	setFormType: React.Dispatch<React.SetStateAction<TFormType>>;
	onFormAction: TFormAction;
}): JSX.Element => {
	const [formState, setFormState] = useState<TFormState>({ roomId: undefined, roomType: undefined, maxMemberCount: undefined });

	const { roomId, roomType, maxMemberCount } = formState;
	const { createRoom } = onFormAction;

	switch (formType) {
		case 'JOIN_ROOM': {
			return (
				<>
					<Input
						type="string"
						placeholder="Private Room Link/Code *"
						value={roomId ?? ''}
						onChange={(e) => {
							e.preventDefault();
							setFormState({ ...formState, roomId: e.target.value });
						}}
					/>
					<Button style={{ marginBottom: '15px' }}>Join Private Room</Button>
					<div className="d-flex">
						<Button onClick={() => setFormType('CREATE_ROOM')}>Create Room</Button>
						<Button>Start Playing!</Button>
					</div>
				</>
			);
		}

		case 'CREATE_ROOM': {
			return (
				<>
					<Input
						required
						type="number"
						placeholder="Maximum No. of Players *"
						min={2}
						max={8}
						value={maxMemberCount ?? 2}
						onChange={(e) => setFormState({ ...formState, maxMemberCount: +e.target.value })}
					/>
					<div style={{ height: '50px' }} className="d-flex align-items-center">
						<RadioButton
							label="Public"
							htmlFor="roomType"
							value={roomType === 'PUBLIC'}
							onChange={() => setFormState({ ...formState, roomType: 'PUBLIC' })}
						/>
						<RadioButton
							label="Private"
							htmlFor="roomType"
							value={roomType === 'PRIVATE'}
							onChange={() => setFormState({ ...formState, roomType: 'PRIVATE' })}
						/>
					</div>
					<Button
						loading={createRoom.isLoading}
						onClick={() =>
							createRoom.callback({
								variables: {
									maxMemberCount,
									roomType,
								},
							})
						}
						style={{ marginBottom: '15px' }}
					>
						Create Room
					</Button>
					<div className="d-flex">
						<Button onClick={() => setFormType('JOIN_ROOM')}>Join Private Room</Button>
						<Button>Start Playing!</Button>
					</div>
				</>
			);
		}

		default:
			return null;
	}
};

const Home: React.FC = () => {
	const [formType, setFormType] = useState<TFormType>('JOIN_ROOM');

	const history = useHistory();

	const [createRoomMutation, { called, loading, data: newRoomData }] = useMutation<ICreateRoomData, ICreateRoomVars>(
		CREATE_ROOM_MUTATION,
	);

	useEffect(() => {
		if (isNotEmptyObject(newRoomData)) {
			const { createRoom } = newRoomData;
			history.push(`/lobby/${createRoom.roomId}`);
		}
	}, [newRoomData]);

	return (
		<div
			className="vw-100 vh-100 overflow-hidden d-flex flex-column justify-content-center"
			style={{ backgroundColor: 'var(--light)' }}
		>
			<Container className="d-flex justify-content-between align-items-center">
				<div className="w-100 d-flex flex-column align-items-center justify-content-center">
					<h2 className="d-inline">Chain Reaction 2D</h2>
					<img src="/images/logo.png" alt="Chain Reaction Logo" width="60px" />
				</div>
				<div className="w-100 d-flex flex-column align-items-center justify-content-center">
					<SideLayout
						formType={formType}
						setFormType={setFormType}
						onFormAction={{
							createRoom: {
								isLoading: called && loading,
								callback: createRoomMutation,
							},
						}}
					/>
				</div>
			</Container>
		</div>
	);
};

/**
 * Styled Components
 */
export const Input = styled.input`
	:focus {
		outline: 0;
	}
	border: 2px solid var(--color-yellow);
	height: 50px;
	font-family: Arvo;
	padding: 10px;
	min-width: 300px;
	margin: 10px;
`;

export default Home;
