const fs = require('fs');
const regExPattern = new RegExp(/-?\d+/gm);
const runSample = true;

const scanY = runSample ? 10 : 2000000;

let input = fs.readFileSync(runSample ? './inputSample.txt' : './input.txt', 'utf8');
input = input.split('\n').map((line) => line.match(regExPattern).map((x) => parseInt(x)));

let intervals = [];

let knownBeacons = new Set();
let impossibleBeacons = new Set();

for (const line of input) {
	let [sensorX, sensorY, beaconX, beaconY] = line;
	let distanceBetweenScannerAndBeacon = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
	let offset = distanceBetweenScannerAndBeacon - Math.abs(sensorY - scanY);

	if (offset < 0) continue;

	let lowX = sensorX - offset;
	let highX = sensorX + offset;

	intervals.push([lowX, highX]);

	if (beaconY === scanY) {
		knownBeacons.add(beaconX);
	}
}

intervals.sort((a, b) => a[0] - b[0]);
let q = []; // Non-overlapping intervals

for (const [low, high] of intervals) {
	if (!q.length) {
		q.push([low, high]);
		continue;
	}

	let [qLow, qHigh] = q[q.length - 1];
	if (qLow > qHigh) {
		q.push([low, high]);
		continue;
	}
	q[q.length - 1][1] = Math.max(qHigh, high);
}

for (const [low, high] of q) {
	for (let i = low; i <= high; i++) {
		impossibleBeacons.add(i);
	}
}

console.log(impossibleBeacons.size - knownBeacons.size);
