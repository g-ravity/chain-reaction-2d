import styled from '@emotion/styled';
import React from 'react';

/**
 * Types
 */
type TLoaderProps = {
	color?: string;
	width: number;
};

/**
 * Components
 */
const Loader = ({ color, width }: TLoaderProps): JSX.Element => {
	return (
		<LoaderDiv color={color} width={width} className="d-flex align-items-center justify-content-center">
			<div className="lds-ring">
				<div />
				<div />
				<div />
				<div />
			</div>
		</LoaderDiv>
	);
};

/**
 * Styled Components
 */
const LoaderDiv = styled.div<{ color?: string; width: number }>`
	.lds-ring {
		display: inline-block;
		position: relative;
		width: ${(props) => `${props.width}px`};
		height: ${(props) => `${props.width}px`};
	}
	.lds-ring div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: ${(props) => `${(props.width * 8) / 10}px`};
		height: ${(props) => `${(props.width * 8) / 10}px`};
		margin: ${(props) => `${props.width / 10}px`};
		border: ${(props) => `${props.width / 10}px`} solid ${(props) => props.color ?? '#fff'};
		border-radius: 50%;
		animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		border-color: ${(props) => props.color ?? '#fff'} transparent transparent transparent;
	}
	.lds-ring div:nth-child(1) {
		animation-delay: -0.45s;
	}
	.lds-ring div:nth-child(2) {
		animation-delay: -0.3s;
	}
	.lds-ring div:nth-child(3) {
		animation-delay: -0.15s;
	}
	@keyframes lds-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

export default Loader;
