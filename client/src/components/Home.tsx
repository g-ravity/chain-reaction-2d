import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import RadioButton from '../reusableComponents/RadioButton';

/**
 * Types
 */
type TForm = 'JOIN_ROOM' | 'CREATE_ROOM';
type TRoomType = 'PUBLIC' | 'PRIVATE';

/**
 * Components
 */
const Home: React.FC = () => {
	const [formType, setFormType] = useState<TForm>('JOIN_ROOM');
	const [roomType, setRoomType] = useState<TRoomType>(undefined);

	const SideLayout = (): JSX.Element => {
		switch (formType) {
			case 'JOIN_ROOM': {
				return (
					<>
						<Input required placeholder="Enter Your Name *" />
						<Input placeholder="Private Room Link/Code *" />
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
						<Input required placeholder="Enter Your Name *" />
						<Input required type="number" placeholder="No. of Players *" min={2} max={8} />
						<div style={{ height: '50px' }} className="d-flex align-items-center">
							<RadioButton
								label="Public"
								htmlFor="roomType"
								value={roomType === 'PUBLIC'}
								onChange={() => setRoomType('PUBLIC')}
							/>
							<RadioButton
								label="Private"
								htmlFor="roomType"
								value={roomType === 'PRIVATE'}
								onChange={() => setRoomType('PRIVATE')}
							/>
						</div>
						<Button style={{ marginBottom: '15px' }}>Create Room</Button>
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
					<SideLayout />
				</div>
			</Container>
		</div>
	);
};

/**
 * Styled Components
 */
const Input = styled.input`
	:focus {
		outline: 0;
	}
	border: 2px solid var(--color-3);
	height: 50px;
	font-family: Arvo;
	padding: 10px;
	min-width: 300px;
	margin: 10px;
`;

const Button = styled.button`
	border: none;
	outline: 0;
	background-color: var(--color-3);
	color: var(--light);
	padding: 10px;
	border-radius: 5px;
	min-width: 150px;
	margin: 5px;
`;

export default Home;
