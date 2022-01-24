import Avatar from 'avataaars';
import React from 'react';
import { Container } from 'react-bootstrap';
import difference from 'lodash/difference';
import { IPlayer } from '../types/Player';
import { allColors, avatarValues, lobbyMembers } from '../utils/constants';
import AvatarMaker from './AvatarMaker';
import { Atom } from './Game';
import { Button, Input } from './Home';
import { TColor } from '../types/Common';

/**
 * Types
 */
interface ILobbyProps {
	roomId: string;
}

/**
 * Components
 */
const Lobby = ({ roomId }: ILobbyProps): JSX.Element => {
	console.log(roomId);
	return (
		<div
			className="vw-100 vh-100 overflow-hidden d-flex flex-column justify-content-center"
			style={{ backgroundColor: 'var(--light)' }}
		>
			<Container className="d-flex justify-content-between align-items-center">
				<div className="w-100">
					<h4>Choose Your Avatar</h4>
					<AvatarMaker />

					<Input className="d-block my-4 mx-auto" required placeholder="Enter Your Name *" />

					<h4 className="mb-3">Pick A Color</h4>
					<div className="d-flex justify-content-start align-items-center flex-wrap">
						{difference(
							allColors,
							lobbyMembers.map((member) => member.color as TColor),
						).map((color) => (
							<Atom style={{ cursor: 'pointer', marginRight: '20px' }} color={color} />
						))}
					</div>

					<div className="d-flex justify-content-center align-items-center">
						<Button className="mt-4">Join</Button>
					</div>
				</div>

				<div className="w-100">
					<h3>Players (7/8)</h3>

					<div className="d-flex flex-wrap justify-content-start align-items-center">
						{(lobbyMembers as IPlayer[]).map((member) => (
							<div className="d-flex flex-column align-items-center justify-content-center m-2">
								<Avatar
									style={{ width: '100px', height: '100px' }}
									avatarStyle="Transparent"
									topType={avatarValues.Top[member.avatar.Top]}
									accessoriesType={avatarValues.Accessories[member.avatar.Accessories]}
									hairColor={avatarValues['Hair Color'][member.avatar['Hair Color']]}
									facialHairType={avatarValues['Facial Hair'][member.avatar['Facial Hair']]}
									facialHairColor={avatarValues['Facial Hair Color'][member.avatar['Facial Hair Color']]}
									clotheType={avatarValues.Clothes[member.avatar.Clothes]}
									clotheColor={avatarValues['Fabric Color'][member.avatar['Fabric Color']]}
									eyeType={avatarValues.Eyes[member.avatar.Eyes]}
									eyebrowType={avatarValues.Eyebrow[member.avatar.Eyebrow]}
									mouthType={avatarValues.Mouth[member.avatar.Mouth]}
									skinColor={avatarValues.Skin[member.avatar.Skin]}
								/>

								<p style={{ margin: '5px 0' }}>{member.name}</p>

								<Atom color={member.color} />
							</div>
						))}
					</div>
				</div>
			</Container>
		</div>
	);
};

export default Lobby;
