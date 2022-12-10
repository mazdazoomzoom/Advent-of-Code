const fs = require('fs');

const getInput = async () => {
	try {
		const data = fs.readFileSync('./input.txt', 'utf8');
		return data.split('\n');
	} catch (error) {
		console.log(error);
	}
};

const useSampleInput = () => {
	return `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`.split('\n');
};

const moveTail = (head, tail) => {
	distanceRow = head[0] - tail[0];
	distanceCol = head[1] - tail[1];

	if (Math.abs(distanceRow) <= 1 && Math.abs(distanceCol) <= 1) {
		return tail;
	} else if (Math.abs(distanceRow) >= 2 && Math.abs(distanceCol) >= 2) {
		tail = [tail[0] < head[0] ? head[0] - 1 : head[0] + 1, tail[1] < head[1] ? head[1] - 1 : head[1] + 1];
	} else if (Math.abs(distanceRow) >= 2) {
		tail = [tail[0] < head[0] ? head[0] - 1 : head[0] + 1, head[1]];
	} else if (Math.abs(distanceCol) >= 2) {
		tail = [head[0], tail[1] < head[1] ? head[1] - 1 : head[1] + 1];
	}
	return tail;
};

const main = async () => {
	try {
		let inputData = await getInput();
		// inputData = useSampleInput();

		inputData = inputData.map((instruction) => instruction.split(' ')).map(([direction, distance]) => [direction, parseInt(distance)]);

		let head = [0, 0];
		let tail = [...Array(9)].map(() => [0, 0]);
		const DirectionRow = { L: 0, R: 0, U: -1, D: 1 };
		const DirectionCol = { L: -1, R: 1, U: 0, D: 0 };

		let tailVisited = new Set();

		for (let instruction of inputData) {
			let [direction, distance] = instruction;

			for (let i = 0; i < distance; i++) {
				tailVisited.add(tail[8].join(','));
				head = [head[0] + DirectionRow[direction], head[1] + DirectionCol[direction]];
				tail[0] = moveTail(head, tail[0]);
				for (let x = 1; x < tail.length; x++) {
					tail[x] = moveTail(tail[x - 1], tail[x]);
				}
				tailVisited.add(tail[8].join(','));
			}
		}

		console.log(tailVisited.size);
	} catch (error) {
		console.error(error);
	}
};

main();
