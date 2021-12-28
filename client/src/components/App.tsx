import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Lottie, { Options } from 'react-lottie';
import { isEqual, isUndefined } from 'lodash';

import animationData from '../assets/explosion.json';
/**
 * Types
 */
interface GridCell {
	hNeighbours: Array<number>;
	vNeighbours: Array<number>;
	count: number;
	maxCount: number;
	explode: boolean;
}

type Grid = Array<Array<GridCell>>;

/**
 * Component
 */
const App: React.FC = () => {
	const [grid, setGrid] = useState<Grid>(undefined);

	const width = 6;
	const height = 9;

	const animationOptions: Options = {
		loop: false,
		autoplay: true,
		animationData,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};

	useEffect(() => {
		const chainGrid: Grid = [];
		for (let i = 0; i < height; i += 1) {
			chainGrid.push([]);
			for (let j = 0; j < width; j += 1) {
				const vNeighbours: Array<number> = [];
				const hNeighbours: Array<number> = [];
				if (i - 1 >= 0) vNeighbours.push(i - 1);
				if (i + 1 < height) vNeighbours.push(i + 1);
				if (j - 1 >= 0) hNeighbours.push(j - 1);
				if (j + 1 < width) hNeighbours.push(j + 1);
				chainGrid[i].push({
					hNeighbours,
					vNeighbours,
					maxCount: vNeighbours.length + hNeighbours.length - 1,
					explode: false,
					count: 0,
				});
			}
		}

		setGrid(chainGrid);
	}, []);

	const addAtom = (row: number, col: number): void => {
		const elem = document.getElementById(row.toString() + col.toString());
		const parentElement = elem.firstChild as HTMLElement;
		const gridCell = { ...grid[row][col] };

		if (isEqual([1, 3], gridCell.hNeighbours) && isEqual([3, 5], gridCell.vNeighbours)) console.log(gridCell);

		if (gridCell.count < gridCell.maxCount) {
			gridCell.count += 1;

			if (gridCell.count === gridCell.maxCount - 1) parentElement.classList.add('medium-rotate');
			if (gridCell.count === gridCell.maxCount) parentElement.classList.replace('medium-rotate', 'high-rotate');
		} else {
			gridCell.count = 0;
			gridCell.explode = true;

			parentElement.innerHTML = '';
			gridCell.vNeighbours.forEach((val) => addAtom(val, col));
			gridCell.hNeighbours.forEach((val) => addAtom(row, val));
		}
		grid[row][col] = gridCell;
		setGrid([...grid]);
	};

	return (
		<div className="vw-100 vh-100 overflow-hidden d-flex flex-column justify-content-center" style={{ backgroundColor: 'var(--dark)' }}>
			<Container>
				<div className="d-flex flex-column justify-content-center">
					{isUndefined(grid)
						? 'Loading...'
						: grid.map((_, iIndex) => (
								<div key={iIndex.toString()}>
									<Row className="justify-content-center">
										{grid[iIndex].map((__, jIndex) => (
											<Cell
												className="d-flex justify-content-center align-items-center overflow-hidden"
												key={jIndex.toString()}
												onClick={(): void => addAtom(iIndex, jIndex)}
												id={iIndex.toString() + jIndex.toString()}
												style={{
													pointerEvents: grid[iIndex][jIndex].explode ? 'none' : 'auto',
												}}
											>
												{grid[iIndex][jIndex].explode ? (
													<Lottie
														options={animationOptions}
														height={150}
														width={150}
														eventListeners={[
															{
																eventName: 'DOMLoaded',
																callback: (): void => {
																	const audio = document.getElementById('audio') as HTMLAudioElement;
																	audio.volume = 0.2;
																	audio.play();
																},
															},
															{
																eventName: 'complete',
																callback: (): void => {
																	grid[iIndex][jIndex].explode = false;
																	setGrid([...grid]);
																},
															},
														]}
													/>
												) : grid[iIndex][jIndex].count === 0 ? (
													<div className="d-flex justify-content-center align-items-center flex-wrap" />
												) : (
													Array.from(Array(grid[iIndex][jIndex].count).keys()).map(() => <Atom />)
												)}
											</Cell>
										))}
									</Row>
								</div>
						  ))}
				</div>
				{/* eslint-disable global-require */}
				<audio id="audio" src={require('../assets/explosion.mp3')}>
					<track kind="captions" srcLang="en" label="English" />
				</audio>
			</Container>
		</div>
	);
};

/**
 * Styled Components
 */
const Cell = styled.div`
	width: 50px;
	height: 50px;
	cursor: pointer;
	border: 1px solid var(--light);
	box-sizing: content-box;

	@media (min-width: 576px) and (min-height: 768px) {
		width: 80px;
		height: 80px;
	}

	@media (min-width: 992px) and (min-height: 1366px) {
		width: 100px;
		height: 100px;
	}

	.medium-rotate {
		animation: rotate 2s linear infinite;
	}

	.high-rotate {
		animation: rotate 1s linear infinite;
	}
`;

const Atom = styled.div`
	background-color: var(--red);
	width: 15px;
	height: 15px;
	border-radius: 15px;
	margin: 2px;

	@media (min-width: 576px) and (min-height: 768px) {
		width: 30px;
		height: 30px;
		border-radius: 30px;
	}

	@media (min-width: 992px) and (min-height: 1366px) {
		width: 40px;
		height: 40px;
		border-radius: 40px;
	}
`;

export default App;
