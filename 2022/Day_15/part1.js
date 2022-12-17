const fs = require('fs');

const input = './input.txt';
const sampleInput = './inputSample.txt';
const runSample = true;

const getInput = async () => {
	try {
		const data = fs.readFileSync(runSample ? sampleInput : input, 'utf8');
		return data.split('\n').map((line) => {
			let sensorX = line.split('x=')[1].split(', y=')[0];
			let sensorY = line.split('y=')[1].split(':')[0];
			let beaconX = line.split('x=')[2].split(', y=')[0];
			let beaconY = line.split('y=')[2];

			return {
				sensor: [sensorX, sensorY].map((x) => parseInt(x)),
				beacon: [beaconX, beaconY].map((x) => parseInt(x)),
			};
		});
	} catch (error) {
		console.log(error);
	}
};

const coordToKey = (cord) => {
	const [x, y] = cord;
	let val = y * 1e3 + x;
	if (x < 0) {
		val = val * -1;
	}
	return val;
};

const keyToCoord = (key) => {
	let y = Math.floor(key / 1e3);
	let x = key % 1e3;
	if (key < 0) {
		x = x - 1e3;
	}
	return [x, y];
};

const main = async () => {
	try {
		let inputData = await getInput();
		let beacons = new Set();
		let sensorRange = new Set();

		// Create set for all beacons
		inputData.forEach((data) => {
			beacons.add(coordToKey(data.beacon));
		});

		inputData.forEach((data) => {
			const addToRange = (cordinates) => {
				let key = coordToKey(cordinates);
				sensorRange.add(key);
				thisSensorRange.add(key);
			};

			let thisSensorRange = new Set();
			let [x, y] = data.sensor;
			addToRange([x, y]);

			let x1 = x;
			let y1 = y;
			let x2 = x;
			let y2 = y;

			if (runSample) {
				if (x == 8 && y == 7) {
					console.log('here');
				}
			}

			while (true) {
				if (thisSensorRange.size > 0) {
					let intersection = new Set([...thisSensorRange].filter((x) => beacons.has(x)));
					if (intersection.size > 0) {
						break;
					}
				}

				// Range Point not found, Expand range by 1;
				x1--;
				x2++;
				y1--;
				y2++;
				// top = [x, y1];
				// bottom = [x, y2];
				// left = [x1, y];
				// right = [x2, y];

				// Fill in Diagonals for top to right;
				for (let i = 0; i < x2 - x; i++) {
					if (runSample) console.log(`Adding Coord: [${x + i}, ${y1 + i}]`);
					addToRange([x + i, y1 + i]);
				}

				// Fill in Diagonals for right to bottom;
				for (let i = 0; i < y2 - y; i++) {
					if (runSample) console.log(`Adding Coord: [${x2 - i}, ${y + i}]`);
					addToRange([x2 - i, y + i]);
				}

				// Fill in Diagonals for bottom to left;
				for (let i = 0; i < x - x1; i++) {
					if (runSample) console.log(`Adding Coord: [${x - i}, ${y2 - i}]`);
					addToRange([x - i, y2 - i]);
				}

				// Fill in Diagonals for left to top;
				for (let i = 0; i < y - y1; i++) {
					if (runSample) console.log(`Adding Coord: [${x1 + i}, ${y - i}]`);
					addToRange([x1 + i, y - i]);
				}
			}
		});

		// Remove beacon points from sensorRange
		// Then create an array of values at y level
		let yLevel = runSample ? 10 : 20000;
		sensorRange = new Set([...sensorRange].filter((x) => !beacons.has(x)));
		sensorRange = Array.from(sensorRange)
			.map((x) => keyToCoord(x))
			.sort((a, b) => a[0] - b[0]);
		sensorRange.map((x) => console.log(x));

		let sensorRangeArr = Array.from(sensorRange)
			.map((x) => keyToCoord(x))
			.filter((x) => x[1] === yLevel)
			.sort((a, b) => a[0] - b[0]);

		console.log(`Part 1: ${sensorRangeArr.length}`);
	} catch (error) {
		console.error(error);
	}
};

main();
