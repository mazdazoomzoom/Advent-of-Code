const fs = require('fs');

const getInput = async () => {
	try {
		const data = fs.readFileSync('./input.txt', 'utf8');
		// const data = fs.readFileSync('./inputSample.txt', 'utf8');

		return data.replace(/\r/g, '').trim().split('\n');
	} catch (error) {
		console.log(error);
	}
};

const createInputMap = (inputData) => {
	const res = {
		start: {},
		end: {},
		map: [],
	};

	res.map = inputData.map((line, y) => {
		// Y is the row index
		return line.split('').map((char, x) => {
			// X is the column index
			if (char === 'S') {
				res.start = { y, x };
				return 0;
			}
			if (char === 'E') {
				res.end = { y, x };
				return 25;
			}

			return char.charCodeAt(0) - 'a'.charCodeAt(0);
		});
	});
	return res;
};

// Create a point to integer function (x, y) => int
// This is used to create a unique key for each point
const pointToInt = (x, y) => {
	return y * 1e3 + x;
};

// Create an integer to point function (int) => {x, y}
// This is used to get the x and y values from a unique key
const intToPoint = (int) => {
	return {
		y: Math.floor(int / 1e3),
		x: int % 1e3,
	};
};

const getNeighbors = (node, map) => {
	const neighbors = [];

	if (node.y + 1 < map.length && map[node.y + 1][node.x] <= map[node.y][node.x] + 1) {
		neighbors.push(pointToInt(node.x, node.y + 1));
	}
	if (node.y - 1 >= 0 && map[node.y - 1][node.x] <= map[node.y][node.x] + 1) {
		neighbors.push(pointToInt(node.x, node.y - 1));
	}
	if (node.x + 1 < map[node.y].length && map[node.y][node.x + 1] <= map[node.y][node.x] + 1) {
		neighbors.push(pointToInt(node.x + 1, node.y));
	}
	if (node.x - 1 >= 0 && map[node.y][node.x - 1] <= map[node.y][node.x] + 1) {
		neighbors.push(pointToInt(node.x - 1, node.y));
	}

	return neighbors;
};

const dijkstra = (inputMap) => {
	const { start, end, map } = inputMap;
	let startKey = pointToInt(start.x, start.y);
	let endKey = pointToInt(end.x, end.y);

	const dist = {};
	const prev = {};
	let queue = [];

	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			const key = pointToInt(x, y);
			dist[key] = Infinity;
			queue.push(key);
		}
	}

	dist[startKey] = 0;

	while (queue.length > 0) {
		let u = null;

		for (const node of queue) {
			if (u === null || dist[node] < dist[u]) {
				u = node;
			}
		}

		if (u === endKey) {
			break;
		}

		queue = queue.filter((node) => node !== u);

		let uPoint = intToPoint(u);
		let neighbors = getNeighbors(uPoint, map);

		for (const v of neighbors) {
			if (queue.includes(v)) {
				const alt = dist[u] + 1;
				if (alt < dist[v]) {
					dist[v] = alt;
					prev[v] = u;
				}
			}
		}
	}
	return dist[endKey];
};

const main = async () => {
	try {
		let inputData = await getInput();
		let inputMap = createInputMap(inputData);
		let result = dijkstra(inputMap);

		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

main();
