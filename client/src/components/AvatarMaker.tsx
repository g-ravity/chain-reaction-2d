import styled from '@emotion/styled';
import Avatar from 'avataaars';
import React, { useState } from 'react';
import { avatarValues } from '../utils/constants';

/**
 * Types
 */
export type TAvatar =
	| 'Top'
	| 'Accessories'
	| 'Hair Color'
	| 'Facial Hair'
	| 'Facial Hair Color'
	| 'Clothes'
	| 'Fabric Color'
	| 'Eyes'
	| 'Eyebrow'
	| 'Mouth'
	| 'Skin';

const avatarPieces: TAvatar[] = [
	'Eyes',
	'Eyebrow',
	'Mouth',
	'Skin',
	'Top',
	'Hair Color',
	'Accessories',
	'Facial Hair',
	'Facial Hair Color',
	'Clothes',
	'Fabric Color',
];

/**
 * Components
 */
const AvatarMaker: React.FC = () => {
	const [avatarPieceIndex, setAvatarPieceIndex] = useState(0);
	const [selectedAvatarStyle, setSelectedAvatarStyle] = useState<{ [key in TAvatar]: number }>({
		Top: 0,
		Accessories: 0,
		'Hair Color': 0,
		'Facial Hair': 0,
		'Facial Hair Color': 0,
		Clothes: 0,
		'Fabric Color': 0,
		Eyes: 0,
		Eyebrow: 0,
		Mouth: 0,
		Skin: 0,
	});

	return (
		<div className="d-flex justify-content-center align-items-center flex-column">
			<Avatar
				style={{ width: '200px', height: '200px' }}
				avatarStyle="Transparent"
				topType={avatarValues.Top[selectedAvatarStyle.Top]}
				accessoriesType={avatarValues.Accessories[selectedAvatarStyle.Accessories]}
				hairColor={avatarValues['Hair Color'][selectedAvatarStyle['Hair Color']]}
				facialHairType={avatarValues['Facial Hair'][selectedAvatarStyle['Facial Hair']]}
				facialHairColor={avatarValues['Facial Hair Color'][selectedAvatarStyle['Facial Hair Color']]}
				clotheType={avatarValues.Clothes[selectedAvatarStyle.Clothes]}
				clotheColor={avatarValues['Fabric Color'][selectedAvatarStyle['Fabric Color']]}
				eyeType={avatarValues.Eyes[selectedAvatarStyle.Eyes]}
				eyebrowType={avatarValues.Eyebrow[selectedAvatarStyle.Eyebrow]}
				mouthType={avatarValues.Mouth[selectedAvatarStyle.Mouth]}
				skinColor={avatarValues.Skin[selectedAvatarStyle.Skin]}
			/>

			<div className="mt-2">
				<StyledArrow
					className="lnr lnr-chevron-left mr-3"
					disabled={!(selectedAvatarStyle[avatarPieces[avatarPieceIndex]] > 0)}
					onClick={() =>
						!(selectedAvatarStyle[avatarPieces[avatarPieceIndex]] > 0)
							? null
							: setSelectedAvatarStyle({
									...selectedAvatarStyle,
									[avatarPieces[avatarPieceIndex]]: selectedAvatarStyle[avatarPieces[avatarPieceIndex]] - 1,
							  })
					}
				/>

				<StyledArrow
					className="lnr lnr-chevron-right"
					disabled={
						!(selectedAvatarStyle[avatarPieces[avatarPieceIndex]] < avatarValues[avatarPieces[avatarPieceIndex]].length - 1)
					}
					onClick={() =>
						!(selectedAvatarStyle[avatarPieces[avatarPieceIndex]] < avatarValues[avatarPieces[avatarPieceIndex]].length - 1)
							? null
							: setSelectedAvatarStyle({
									...selectedAvatarStyle,
									[avatarPieces[avatarPieceIndex]]: selectedAvatarStyle[avatarPieces[avatarPieceIndex]] + 1,
							  })
					}
				/>
			</div>

			<div className="mt-2">
				<StyledArrow
					disabled={!(avatarPieceIndex > 0)}
					className="lnr lnr-chevron-left mr-3"
					onClick={() => (!(avatarPieceIndex > 0) ? null : setAvatarPieceIndex(avatarPieceIndex - 1))}
				/>

				{avatarPieces[avatarPieceIndex]}

				<StyledArrow
					disabled={!(avatarPieceIndex < avatarPieces.length - 1)}
					className="lnr lnr-chevron-right ml-3"
					onClick={() => (!(avatarPieceIndex < avatarPieces.length - 1) ? null : setAvatarPieceIndex(avatarPieceIndex + 1))}
				/>
			</div>
		</div>
	);
};

/**
 * Styled Components
 */
const StyledArrow = styled.span<{ disabled?: boolean }>`
	cursor: pointer;
	color: ${(props) => (props.disabled ? 'var(--semi-dark)' : 'var(--dark)')};
`;

export default AvatarMaker;
