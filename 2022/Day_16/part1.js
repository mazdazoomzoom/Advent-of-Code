const fs = require('fs');

const runSample = true;

const valves = {};
const tunnels = {};

for (const line of fs.readFileSync(runSample ? 'inputSample.txt' : 'input.txt', 'utf8').split('\n')) {
	let valve = line.split(' ')[1];
	let flow = parseInt(line.split(';')[0].split('=')[1]);
	let targets = line.split('to ')[1].split(' ');
	targets.shift();
	targets = targets.join(' ').split(', ');
	valves[valve] = flow;
	tunnels[valve] = targets;
}

const distances = {};
const nonempty = [];

for (const valve of Object.keys(valves)) {
	if (valve !== 'AA' && !valves[valve]) continue;
	if (valve !== 'AA') nonempty.push(valve);

	distances[valve] = { [valve]: 0, AA: 0 };
	const visited = new Set([valve]);

	const queue = [[0, valve]];
	while (queue.length > 0) {
		const [distance, position] = queue.shift();
		for (const neighbor of tunnels[position]) {
			if (visited.has(neighbor)) continue;
			visited.add(neighbor);
			if (valves[neighbor]) {
				distances[valve][neighbor] = distance + 1;
			}
			queue.push([distance + 1, neighbor]);
		}
	}

	delete distances[valve][valve];
	if (valve !== 'AA') {
		delete distances[valve]['AA'];
	}
}

const indices = {};

for (const [index, element] of nonempty.entries()) {
	indices[element] = index;
}

const cache = {};

const dfs = (time, valve, bitmask) => {
	if (cache[(time, valve, bitmask)]) return cache[(time, valve, bitmask)];

	let maxValue = 0;
	for (const neighbor of Object.keys(distances[valve])) {
		const bit = 1 << indices[neighbor];
		if (bitmask & bit) continue;
		const remainingTime = time - distances[valve][neighbor] - 1;
		if (remainingTime <= 0) continue;
		maxValue = Math.max(maxValue, dfs(remainingTime, neighbor, bitmask | bit) + valves[neighbor] * remainingTime);
	}

	cache[(time, valve, bitmask)] = maxValue;
	return maxValue;
};

let result = dfs(30, 'AA', 0);
console.log(result);
