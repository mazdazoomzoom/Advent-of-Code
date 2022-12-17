const fs = require('fs');
const regExPattern = new RegExp(/-?\d+/gm);
const runSample = false;

let input = fs.readFileSync(runSample ? './inputSample.txt' : './input.txt', 'utf8');
input = input.split('\n').map((line) => line.match(regExPattern).map((x) => parseInt(x)));

const SearchBound = runSample ? 20 : 4000000;

for (let scanY = 0; scanY <= SearchBound; scanY++) {
	let intervals = [];

	for (const line of input) {
		let [sensorX, sensorY, beaconX, beaconY] = line;
		let distanceBetweenScannerAndBeacon = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
		let offset = distanceBetweenScannerAndBeacon - Math.abs(sensorY - scanY);

		if (offset < 0) continue;

		let lowX = sensorX - offset;
		let highX = sensorX + offset;
		intervals.push([lowX, highX]);
	}

	intervals.sort((a, b) => {
		if (a[0] === b[0]) return a[1] - b[1];
		return a[0] - b[0];
	});
	let q = []; // Non-overlapping intervals

	for (const [low, high] of intervals) {
		if (!q.length) {
			q.push([low, high]);
			continue;
		}

		let [qLow, qHigh] = q[q.length - 1];
		if (low > qHigh + 1) {
			q.push([low, high]);
			continue;
		}
		q[q.length - 1][1] = Math.max(qHigh, high);
	}

	let x = 0;
	for (const [low, high] of q) {
		if (x < low) {
			console.log(`Found at ${x},${scanY}`);
			console.log(`Answer: ${x * 4000000 + scanY}`);
			process.exit(0);
		}
		x = Math.max(x, high + 1);
		if (x > SearchBound) break;
	}
}
