const fs = require('fs');

const input = './input.txt';
const sampleInput = './inputSample.txt';
const runSample = false;

const air = ' ';
const rock = '#';
const sand = '.';
const showSimulation = false;
const simSpeed = 75; // Lower than 75 causes the screen to flicker

const displayGrid = async (grid, runs) => {
	await new Promise((resolve) =>
		setTimeout(() => {
			grid = grid.map((row) => row.map((char) => (char === rock ? '\x1b[31m' + rock + '\x1b[37m' : char)));
			console.clear();
			console.log(grid.map((row) => row.join('')).join('\n'));
			resolve(console.log('Sand on screen: ' + '\x1b[32m' + runs + '\x1b[37m'));
		}, simSpeed)
	);
};

const getInput = async () => {
	try {
		const data = fs.readFileSync(runSample ? sampleInput : input, 'utf8');
		return data.split('\n').map((line) => line.split(' -> ').map((cord) => cord.split(',').map((num) => parseInt(num))));
	} catch (error) {
		console.log(error);
	}
};

const convertXToGrid = (x, minX) => {
	return x - minX;
};

const buildGrid = (inputData, sandSource) => {
	let minX = Infinity;
	let maxX = 0;
	let minY = Infinity;
	let maxY = 0;

	inputData.forEach((line) => {
		line.forEach((coordinate) => {
			if (coordinate[0] < minX) {
				minX = coordinate[0];
			}
			if (coordinate[0] > maxX) {
				maxX = coordinate[0];
			}
			if (coordinate[1] < minY) {
				minY = coordinate[1];
			}
			if (coordinate[1] > maxY) {
				maxY = coordinate[1];
			}
		});
	});

	let grid = Array.from(Array(maxY + 1), () => new Array(maxX - minX + 1).fill(air));
	grid[sandSource[1]][convertXToGrid(sandSource[0], minX)] = '+';

	inputData.forEach((line) => {
		for (let index = 0; index < line.length - 1; index++) {
			const x = line[index][0];
			const y = line[index][1];
			const x2 = line[index + 1][0];
			const y2 = line[index + 1][1];

			if (x === x2) {
				let vals = [y, y2].sort((a, b) => a - b);
				for (let i = vals[0]; i <= vals[1]; i++) {
					grid[i][convertXToGrid(x, minX)] = rock;
				}
			}

			if (y === y2) {
				let vals = [x, x2].sort((a, b) => a - b);
				for (let i = vals[0]; i <= vals[1]; i++) {
					grid[y][convertXToGrid(i, minX)] = rock;
				}
			}
		}
	});

	grid = [...grid, Array.from(Array(maxX - minX + 1), () => air), Array.from(Array(maxX - minX + 1), () => rock)];

	return { grid, minX, maxX, minY, maxY };
};

const simulateSandFlow = async (grid, sandSource, bounds, runs = 1) => {
	// A unit of sand always falls down one step if possible.
	// If the tile immediately below is blocked (by rock or sand),
	// the unit of sand attempts to instead move diagonally one step down and to the left.
	// If that tile is blocked, the unit of sand attempts to instead move diagonally one step down and to the right.
	// Sand keeps moving as long as it is able to do so, at each step trying to move down, then down-left, then down-right.
	// If all three possible destinations are blocked, the unit of sand comes to rest and no longer moves,
	// at which point the next unit of sand is created back at the source.

	// The sand source is located at the top of the grid, and the sand flows downward.
	// The grid is bounded on the left and right by walls of rock, and on the bottom by a wall of rock.
	// The grid is bounded on the top by open air.

	const { minX, maxX, maxY } = bounds;
	let sandStart = [convertXToGrid(sandSource[0], minX), sandSource[1] + 1];
	let sandFinalPosition = await calcSandFinalPosition(grid, sandStart);

	if (sandFinalPosition[0] < 0) {
		// Add new column to left
		grid = grid.map((row) => [air, ...row]);
		grid[grid.length - 1][0] = rock;
		return await simulateSandFlow(grid, sandSource, { minX: minX - 1, maxX, maxY }, runs);
	} else if (sandFinalPosition[0] > grid[0].length - 1) {
		// Add new column to right
		grid = grid.map((row) => [...row, air]);
		grid[grid.length - 1][grid[0].length - 1] = rock;
		return await simulateSandFlow(grid, sandSource, { minX, maxX: maxX + 1, maxY }, runs);
	} else if (sandFinalPosition[1] <= 0) {
		return { finalGrid: grid, runs };
	}

	grid[sandFinalPosition[1]][sandFinalPosition[0]] = sand;

	if (showSimulation) {
		await displayGrid(grid, runs);
	}

	return await simulateSandFlow(grid, sandSource, bounds, runs + 1);
};

const calcSandFinalPosition = async (grid, sandPosition) => {
	let sandX = sandPosition[0];
	let sandY = sandPosition[1];

	if (sandY < 0) {
		return [sandX, sandY];
	}

	if (sandX == 0) {
		return [sandX - 1, sandY];
	} else if (sandX == grid[0].length - 1) {
		return [sandX + 1, sandY];
	}

	if (sandY >= grid.length) {
		y--;
		return [sandX, sandY];
	}

	let row = grid[sandY];
	let tile = row[sandX];

	if (tile === rock) {
		// Sand hits rock - Blocked
		// Check if sand can flow left or right
		let moveSand = sandToMoveWhenBlocked(row, sandX);
		if (moveSand === 0) {
			sandY--;
			return [sandX, sandY];
		} else {
			sandX += moveSand;
			if (sandX < 0 || sandX > row.length) {
				return [sandX, sandY];
			}
			return await calcSandFinalPosition(grid, [sandX, sandY]);
		}
	} else if (tile === air) {
		// Sand hits empty space - Flow down
		sandY++;
		return await calcSandFinalPosition(grid, [sandX, sandY]);
	} else if (tile === sand) {
		// Sand hits other sand - Blocked
		// Check if sand can flow left or right
		let moveSand = sandToMoveWhenBlocked(row, sandX);
		if (moveSand === 0) {
			sandY--;
			return [sandX, sandY];
		} else {
			sandX += moveSand;
			if (sandX < 0 || sandX > row.length) {
				return [sandX, sandY];
			}
			return await calcSandFinalPosition(grid, [sandX, sandY]);
		}
	}
};

const sandToMoveWhenBlocked = (row, sandX) => {
	if (!row[sandX - 1] || row[sandX - 1] === air) {
		return -1;
	} else if (!row[sandX + 1] || row[sandX + 1] === air) {
		return 1;
	} else {
		return 0;
	}
};

const main = async () => {
	try {
		let inputData = await getInput();
		let sandSource = [500, 0];

		let { grid, minX, minY, maxX, maxY } = buildGrid(inputData, sandSource);
		let { finalGrid, runs } = await simulateSandFlow(grid, sandSource, { minX, minY, maxX, maxY });
		await displayGrid(finalGrid, runs);
	} catch (error) {
		console.error(error);
	}
};

main();
