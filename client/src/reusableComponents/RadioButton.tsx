import styled from '@emotion/styled';
import React from 'react';
/**
 * Types
 */
type TRadioButtonProps = {
	label: string;
	value: boolean;
	htmlFor: string;
	onChange: () => void;
};

/**
 * Components
 */
const RadioButton = ({ label, value, onChange, htmlFor }: TRadioButtonProps): JSX.Element => {
	return (
		<label htmlFor={htmlFor} style={{ marginRight: '10px' }}>
			<StyledRadioInput type="radio" checked={value} onChange={onChange} />
			{label}
		</label>
	);
};

/**
 * Styled Components
 */
const StyledRadioInput = styled.input`
	margin-right: 5px;

	:after {
		width: 15px;
		height: 15px;
		border-radius: 15px;
		top: -2px;
		left: -1px;
		position: relative;
		background-color: var(--semi-dark);
		content: '';
		display: inline-block;
		visibility: visible;
		border: 2px solid white;
	}

	:checked:after {
		width: 15px;
		height: 15px;
		border-radius: 15px;
		top: -2px;
		left: -1px;
		position: relative;
		background-color: var(--color-yellow);
		content: '';
		display: inline-block;
		visibility: visible;
		border: 2px solid white;
	}
`;

export default RadioButton;
