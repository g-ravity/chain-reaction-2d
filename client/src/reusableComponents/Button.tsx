import styled from '@emotion/styled';
import React from 'react';
import { ButtonProps } from 'react-bootstrap';
import { omitWrapper } from '../utils/commonHelpers';
import Loader from './Loader';

/**
 * Types
 */
interface IButtonProps extends ButtonProps {
	loading?: boolean;
	loaderColor?: string;
}

/**
 * Components
 */
const Button = (props: IButtonProps): JSX.Element => {
	const { loading, loaderColor } = props;
	return loading ? (
		<StyledButton>
			<Loader color={loaderColor} width={20} />
		</StyledButton>
	) : (
		<StyledButton {...omitWrapper(props as unknown as Record<string, unknown>, ['loading', 'loaderColor'])} />
	);
};

/**
 * Styled Components
 */
export const StyledButton = styled.button`
	border: none;
	outline: 0;
	background-color: var(--color-yellow);
	color: var(--light);
	padding: 10px;
	border-radius: 5px;
	min-width: 150px;
	margin: 5px;
`;

export default Button;
