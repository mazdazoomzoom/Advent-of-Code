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

let cubeLocations = data.split('\n').map((row) => row.split(',').map(Number));

for (let [x, y, z] of cubeLocations) {
	for (let [dx, dy, dz] of offsets) {
		let key = [x + dx, y + dy, z + dz].join(',');
		if (!faces[key]) {
			faces[key] = 0;
		}
		faces[key]++;
	}
}

// Filter out all the faces that are not equal to 1
faces = Object.keys(faces).filter((key) => faces[key] === 1);
console.log(faces.length);
