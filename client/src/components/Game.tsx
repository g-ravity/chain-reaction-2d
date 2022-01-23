import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ReactDOMServer from 'react-dom/server';
import isUndefined from 'lodash/isUndefined';
import { ANIMATION_TIME, GRID_HEIGHT, GRID_WIDTH } from '../utils/constants';

/**
 * Types
 */
type TDirection = 'left' | 'right' | 'up' | 'down';

interface GridCell {
	hNeighbours: Array<number>;
	vNeighbours: Array<number>;
	explodeDirections: Array<TDirection>;
	count: number;
	maxCount: number;
	explode: boolean;
}

type Grid = Array<Array<GridCell>>;

interface IAddAtom {
	row: number;
	col: number;
	latestGrid: Grid;
	isClicked?: boolean;
}

/**
 * Utility Functions
 */
const playAudio = () => {
	const audio = document.getElementById('audio') as HTMLAudioElement;
	const clonedAudio = audio.cloneNode() as HTMLAudioElement;
	clonedAudio.volume = 0.5;
	clonedAudio.play();
};

const explosionAnimation = ({ row, col, elem, type }: { row: number; col: number; elem: GridCell; type: 'PLAY' | 'RESET' }): void => {
	switch (type) {
		case 'PLAY': {
			return elem.explodeDirections.forEach((direction) => {
				const animElem = document.getElementById(`${`${row.toString() + col.toString()}${direction}`}`);
				animElem.classList.add(`move-${direction}`);
				animElem.classList.replace('d-none', 'd-block');
			});
		}

		case 'RESET': {
			return elem.explodeDirections.forEach((direction) => {
				const animElem = document.getElementById(`${`${row.toString() + col.toString()}${direction}`}`);
				animElem.classList.replace('d-block', 'd-none');
				animElem.classList.remove(`move-${direction}`);
			});
		}

		default:
			return null;
	}
};

/**
 * Component
 */
const Game: React.FC = () => {
	const [grid, setGrid] = useState<Grid>(undefined);

	const width = GRID_WIDTH;
	const height = GRID_HEIGHT;

	useEffect(() => {
		const chainGrid: Grid = [];
		for (let i = 0; i < height; i += 1) {
			chainGrid.push([]);
			for (let j = 0; j < width; j += 1) {
				const vNeighbours: Array<number> = [];
				const hNeighbours: Array<number> = [];
				const explodeDirections: Array<TDirection> = [];
				if (i - 1 >= 0) {
					vNeighbours.push(i - 1);
					explodeDirections.push('up');
				}
				if (i + 1 < height) {
					vNeighbours.push(i + 1);
					explodeDirections.push('down');
				}
				if (j - 1 >= 0) {
					hNeighbours.push(j - 1);
					explodeDirections.push('left');
				}
				if (j + 1 < width) {
					hNeighbours.push(j + 1);
					explodeDirections.push('right');
				}
				chainGrid[i].push({
					hNeighbours,
					vNeighbours,
					explodeDirections,
					maxCount: vNeighbours.length + hNeighbours.length - 1,
					explode: false,
					count: 0,
				});
			}
		}

		setGrid(chainGrid);
	}, []);

	const addAtom = ({ row, col, latestGrid, isClicked = false }: IAddAtom): void => {
		setTimeout(
			() => {
				const gridCell = latestGrid[row][col];
				const parentElement = document.getElementById(row.toString() + col.toString());

				if (gridCell.count < gridCell.maxCount) {
					gridCell.count += 1;
					const atom = ReactDOMServer.renderToStaticMarkup(
						parentElement.childElementCount === 2 ? <Atom style={{ margin: '-3px' }} /> : <Atom />,
					);

					const template = document.createElement('template');
					template.innerHTML = atom;
					parentElement.appendChild(template.content.firstChild);

					if (gridCell.count === gridCell.maxCount - 1) parentElement.classList.add('medium-rotate');
					if (gridCell.count === gridCell.maxCount) parentElement.classList.replace('medium-rotate', 'high-rotate');
				} else {
					gridCell.count = 0;

					parentElement.innerHTML = '';
					parentElement.classList.remove('high-rotate');

					explosionAnimation({ row, col, elem: grid[row][col], type: 'PLAY' });
					playAudio();

					setTimeout(() => {
						explosionAnimation({ row, col, elem: grid[row][col], type: 'RESET' });
					}, ANIMATION_TIME + 50);

					latestGrid[row][col] = gridCell;

					gridCell.vNeighbours.forEach((val) => addAtom({ row: val, col, latestGrid }));
					gridCell.hNeighbours.forEach((val) => addAtom({ row, col: val, latestGrid }));
				}

				grid[row][col] = gridCell;
				setGrid([...grid]);
			},
			isClicked ? 0 : ANIMATION_TIME,
		);
	};

	return (
		<div
			className="vw-100 vh-100 overflow-hidden d-flex flex-column justify-content-center"
			style={{ backgroundColor: 'var(--light)' }}
		>
			<Container>
				<div className="d-flex flex-column justify-content-center">
					{isUndefined(grid)
						? 'Loading...'
						: grid.map((_, iIndex) => (
								<div key={iIndex.toString()}>
									<Row className="justify-content-center">
										{grid[iIndex].map((__, jIndex) => (
											<>
												<Cell
													className="d-flex justify-content-center align-items-center"
													key={jIndex.toString()}
													onClick={(): void =>
														addAtom({ row: iIndex, col: jIndex, latestGrid: grid, isClicked: true })
													}
													style={{
														pointerEvents: grid[iIndex][jIndex].explode ? 'none' : 'auto',
													}}
												>
													<div
														id={iIndex.toString() + jIndex.toString()}
														className="d-flex justify-content-center align-items-center flex-wrap"
													/>
													{[...Array(grid[iIndex][jIndex].maxCount + 1).keys()].map((index) => (
														<Cell
															id={
																iIndex.toString() +
																jIndex.toString() +
																grid[iIndex][jIndex].explodeDirections[index]
															}
															className="d-none position-absolute justify-content-center align-items-center overflow-hidden"
															key={`${jIndex.toString()}-move-${
																grid[iIndex][jIndex].explodeDirections[index]
															}`}
															style={{ border: 'none' }}
														>
															<div className="d-flex justify-content-center align-items-center flex-wrap h-100">
																<Atom />
															</div>
														</Cell>
													))}
												</Cell>
											</>
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
	border: 2px solid var(--dark);
	box-sizing: content-box;

	@media (min-width: 576px) and (min-height: 768px) {
		width: 70px;
		height: 70px;
	}

	@media (min-width: 992px) and (min-height: 1366px) {
		width: 85px;
		height: 85px;
	}

	.medium-rotate {
		animation: rotate 2s linear infinite;
	}

	.high-rotate {
		animation: rotate 1s linear infinite;
	}

	.move-up {
		animation: move-up ${ANIMATION_TIME / 1000}s linear forwards;
	}

	.move-down {
		animation: move-down ${ANIMATION_TIME / 1000}s linear forwards;
	}

	.move-left {
		animation: move-left ${ANIMATION_TIME / 1000}s linear forwards;
	}

	.move-right {
		animation: move-right ${ANIMATION_TIME / 1000}s linear forwards;
	}
`;

const Atom = styled.div`
	background-color: var(--color-4);
	width: 15px;
	height: 15px;
	border-radius: 15px;
	margin: 2px;

	@media (min-width: 576px) and (min-height: 768px) {
		width: 25px;
		height: 25px;
		border-radius: 25px;
	}

	@media (min-width: 992px) and (min-height: 1366px) {
		width: 30px;
		height: 30px;
		border-radius: 30px;
	}
`;

export default Game;
