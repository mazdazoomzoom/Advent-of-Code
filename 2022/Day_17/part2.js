const fs = require('fs');
const runSample = false;
const directions = fs.readFileSync(runSample ? './inputSample.txt' : './input.txt', 'utf8').split('');

// App Start

let runs = 0;
let part1 = false;
const testToRun = part1 ? 2022 : 1000000000000;
let piecesOnBoard = 0;

const getNextPiece = () => {
	let piece;

	switch (piecesOnBoard % 5) {
		case 0:
			// Piece Shape -
			piece = [['', '', '@', '@', '@', '@', '']];
			break;
		case 1:
			// Piece Shape +
			piece = [
				['', '', '', '@', '', '', ''],
				['', '', '@', '@', '@', '', ''],
				['', '', '', '@', '', '', ''],
			];

			break;
		case 2:
			// Piece Shape Backwards L
			piece = [
				['', '', '', '', '@', '', ''],
				['', '', '', '', '@', '', ''],
				['', '', '@', '@', '@', '', ''],
			];
			break;
		case 3:
			// Piece Shape |
			piece = [
				['', '', '@', '', '', '', ''],
				['', '', '@', '', '', '', ''],
				['', '', '@', '', '', '', ''],
				['', '', '@', '', '', '', ''],
			];
			break;
		case 4:
			// Piece Shape Square
			piece = [
				['', '', '@', '@', '', '', ''],
				['', '', '@', '@', '', '', ''],
			];
			break;
		default:
			return;
	}
	return piece;
};

const getNextDirection = () => {
	return directions[runs % directions.length];
};

const createBoard = () => {
	let board = Array(3).fill(Array(7).fill('')); // 3x7
	return board;
};

const addPieceToBoard = (board, piece) => {
	if (runs !== 0) {
		board = [...Array(3).fill(Array(7).fill('')), ...board];
	}
	board = [...piece, ...board];
	return board;
};

const simPieceFalling = (board, direction) => {
	let rowMin, rowMax;
	let needNewPiece = false;

	// Bounds are horizontal are 0-6
	// Find the lowest row of the piece
	let pieceCoords = [];
	let newPieceCoords = [];
	board.map((row, rowIndex) => {
		row.map((col, colIndex) => {
			if (col === '@') {
				pieceCoords.push([rowIndex, colIndex]);
			}
		});
	});

	switch (direction) {
		case '>':
			// Move piece right
			let rightMostCoords = [];
			let canMoveRight = true;

			rowMin = Math.min(...pieceCoords.map((coord) => coord[0]));
			rowMax = Math.max(...pieceCoords.map((coord) => coord[0]));

			for (let row = rowMin; row <= rowMax; row++) {
				let coordsOfRow = pieceCoords.filter((coord) => coord[0] === row);
				let colMax = Math.max(...coordsOfRow.map((coord) => coord[1]));
				rightMostCoords.push([row, colMax]);
			}

			for (let coord of rightMostCoords) {
				if (board[coord[0]][coord[1] + 1] === '#') {
					canMoveRight = false;
					break;
				}
				if (coord[1] === 6) {
					canMoveRight = false;
					break;
				}
			}

			if (canMoveRight) {
				// Move piece right
				newPieceCoords = pieceCoords.map((coord) => [coord[0], coord[1] + 1]);
				board = board.map((row, rowIndex) => {
					return row.map((col, colIndex) => {
						if (pieceCoords.find((coord) => coord[0] === rowIndex && coord[1] === colIndex) !== undefined) {
							col = '';
						}

						if (newPieceCoords.find((coord) => coord[0] === rowIndex && coord[1] === colIndex) !== undefined) {
							col = '@';
						}
						return col;
					});
				});
			} else {
				newPieceCoords = [...pieceCoords];
			}
			break;
		case '<':
			// Move piece left
			let leftMostCoords = [];
			let canMoveLeft = true;
			rowMin = Math.min(...pieceCoords.map((coord) => coord[0]));
			rowMax = Math.max(...pieceCoords.map((coord) => coord[0]));

			for (let row = rowMin; row <= rowMax; row++) {
				let coordsOfRow = pieceCoords.filter((coord) => coord[0] === row);
				let colMin = Math.min(...coordsOfRow.map((coord) => coord[1]));
				leftMostCoords.push([row, colMin]);
			}

			for (let coord of leftMostCoords) {
				if (board[coord[0]][coord[1] - 1] === '#') {
					canMoveLeft = false;
					break;
				}
				if (coord[1] === 0) {
					canMoveLeft = false;
					break;
				}
			}

			if (canMoveLeft) {
				// Move piece right
				newPieceCoords = pieceCoords.map((coord) => [coord[0], coord[1] - 1]);
				board = board.map((row, rowIndex) => {
					return row.map((col, colIndex) => {
						if (pieceCoords.find((coord) => coord[0] === rowIndex && coord[1] === colIndex) !== undefined) {
							col = '';
						}

						if (newPieceCoords.find((coord) => coord[0] === rowIndex && coord[1] === colIndex) !== undefined) {
							col = '@';
						}
						return col;
					});
				});
			} else {
				newPieceCoords = [...pieceCoords];
			}
			break;
	}

	// Move piece down
	let rowMaxCoords = [];
	let canMoveDown = true;
	let minCol = Math.min(...newPieceCoords.map((coord) => coord[1]));
	let maxCol = Math.max(...newPieceCoords.map((coord) => coord[1]));

	for (let col = minCol; col <= maxCol; col++) {
		let coordsOfCol = newPieceCoords.filter((coord) => coord[1] === col);
		let rowMax = Math.max(...coordsOfCol.map((coord) => coord[0]));
		rowMaxCoords.push([rowMax, col]);
	}

	for (let coord of rowMaxCoords) {
		if (coord[0] == board.length - 1) {
			canMoveDown = false;
			break;
		}
		if (board[coord[0] + 1][coord[1]] == '#') {
			canMoveDown = false;
			break;
		}
	}

	if (canMoveDown) {
		// Move piece down
		pieceCoords = [...newPieceCoords];
		newPieceCoords = pieceCoords.map((coord) => [coord[0] + 1, coord[1]]);
		board = board.map((row, rowIndex) => {
			return row.map((col, colIndex) => {
				if (pieceCoords.find((coord) => coord[0] === rowIndex && coord[1] === colIndex) !== undefined) {
					col = '';
				}

				if (newPieceCoords.find((coord) => coord[0] === rowIndex && coord[1] === colIndex) !== undefined) {
					col = '@';
				}
				return col;
			});
		});
	} else {
		// Piece has landed
		board = board.map((row, rowIndex) => {
			return row.map((col, colIndex) => {
				if (newPieceCoords.find((coord) => coord[0] === rowIndex && coord[1] === colIndex) !== undefined) {
					col = '#';
				}
				return col;
			});
		});

		needNewPiece = true;
	}

	return { board, needNewPiece };
};

const main = async () => {
	try {
		let height = 0;
		let piece;
		let direction;
		let board = createBoard();

		while (piecesOnBoard < testToRun) {
			if (piece === undefined) {
				piece = getNextPiece();
				board = addPieceToBoard(board, piece);
			}
			direction = getNextDirection();
			let result = simPieceFalling(board, direction);
			board = [...result.board];
			if (result.needNewPiece) {
				piece = undefined;
				piecesOnBoard++;

				// Trim top of board if no pieces are there
				board = board.filter((row) => {
					if (row.find((col) => col === '#') !== undefined) {
						return true;
					}
				});

				if (piecesOnBoard % 100 === 0) {
					height += board.length;
					board = board.slice(0, 20);
					height -= 20;
				}
			}

			if (runs % 10000 === 0) {
				console.log(`Runs: ${runs}; Pieces on board: ${piecesOnBoard}; Height: ${height}; Pieces to go: ${testToRun - piecesOnBoard}`);
			}

			runs++;
		}

		// Find height of rocks in board
		board = board.filter((row) => {
			if (row.find((col) => col === '#') !== undefined) {
				return true;
			}
		});

		height += board.length;
		console.log(`Height: ${height}; Pieces on board: ${piecesOnBoard}`);
	} catch (error) {
		console.error(error);
	}
};

main();
