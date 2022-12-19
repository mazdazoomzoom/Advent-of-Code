const fs = require('fs');

const input = './input.txt';
const sampleInput = './inputSample.txt';
const runSample = false;

const data = fs.readFileSync(runSample ? sampleInput : input, 'utf8');

/*
 * Puzzle Start
 */

let faces = {};
let offsets = [
	[0, 0, 0.5],
	[0, 0.5, 0],
	[0.5, 0, 0],
	[0, 0, -0.5],
	[0, -0.5, 0],
	[-0.5, 0, 0],
];

let droplet = new Set();
let airSpaces = new Set();
let free = new Set();

let minX, minY, minZ, maxX, maxY, maxZ;
minX = minY = minZ = Infinity;
maxX = maxY = maxZ = -Infinity;

let cubeLocations = data.split('\n').map((row) => row.split(',').map(Number));

for (let [x, y, z] of cubeLocations) {
	droplet.add([x, y, z].join(','));

	minX = Math.min(minX, x);
	minY = Math.min(minY, y);
	minZ = Math.min(minZ, z);

	maxX = Math.max(maxX, x);
	maxY = Math.max(maxY, y);
	maxZ = Math.max(maxZ, z);

	for (let [dx, dy, dz] of offsets) {
		let key = [x + dx, y + dy, z + dz].join(',');
		if (!faces[key]) {
			faces[key] = 0;
		}
		faces[key]++;
	}
}

// Increase the bounds by 1 in all directions
minX -= 1;
minY -= 1;
minZ -= 1;
maxX += 1;
maxY += 1;
maxZ += 1;

let q = [[minX, minY, minZ]];
airSpaces.add([minX, minY, minZ].join(','));

while (q.length) {
	let [x, y, z] = q.shift();

	for (let [dx, dy, dz] of offsets) {
		let [newX, newY, newZ] = [x + dx * 2, y + dy * 2, z + dz * 2];
		let key = [newX, newY, newZ].join(',');

		if (!(minX <= newX && newX <= maxX) || !(minY <= newY && newY <= maxY) || !(minZ <= newZ && newZ <= maxZ)) {
			continue;
		}

		if (droplet.has(key) || airSpaces.has(key)) {
			continue;
		}

		airSpaces.add(key);
		q.push([newX, newY, newZ]);
	}
}

for (let space of airSpaces) {
	let [x, y, z] = space.split(',').map(Number);
	for (let [dx, dy, dz] of offsets) {
		let key = [x + dx, y + dy, z + dz].join(',');
		free.add(key);
	}
}

let total = 0;

for (let key in faces) {
	if (free.has(key)) {
		total++;
	}
}

console.log(total);
