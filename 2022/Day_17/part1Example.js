const fs = require('fs');
const runSample = false;
const directions = fs.readFileSync(runSample ? './inputSample.txt' : './input.txt', 'utf8').split('');

// App Start

const rocks = [
	[
		[0, 0],
		[1, 0],
		[2, 0],
		[3, 0],
	],
	[
		[1, 0],
		[0, 1],
		[1, 1],
		[2, 1],
		[1, 2],
	],
	[
		[0, 0],
		[1, 0],
		[2, 0],
		[2, 1],
		[2, 2],
	],
	[
		[0, 0],
		[0, 1],
		[0, 2],
		[0, 3],
	],
	[
		[0, 0],
		[1, 0],
		[0, 1],
		[1, 1],
	],
];

const jets = [...directions.map((direction) => (direction == '>' ? 1 : -1))];

let solid = new Set();
for (let i = 0; i < 7; i++) {
	solid.add([i, -1].join(','));
}

const checkIntersectionWithSolid = (rock) => {
	let hasIntersection = false;
	for (let [x, y] of rock) {
		if (solid.has([x, y].join(','))) {
			hasIntersection = true;
			break;
		}
	}

	return hasIntersection;
};

const checkIntersectionWithChamber = (rock) => {
	let hasIntersection = false;
	for (let [x, y] of rock) {
		if (0 > x || x > 6) {
			hasIntersection = true;
			break;
		}
	}

	return hasIntersection;
};

const createRock = (rockIndex) => {
	return rocks[rockIndex].map(([x, y]) => [x + 2, y + height + 3]);
};

const showChamber = (rock) => {
	let chamber = [];
	for (let y = 0; y < height; y++) {
		chamber.push([]);
		chamber[y].push('|');
		for (let x = 0; x < 7; x++) {
			chamber[y].push(solid.has([x, y].join(',')) ? '#' : '.');
		}
		chamber[y].push('|');
	}

	// Add 3 empty rows and rock

	for (let i = 0; i < 7; i++) {
		chamber.push([]);
		chamber[chamber.length - 1].push('|');
		for (let x = 0; x < 7; x++) {
			chamber[chamber.length - 1].push('.');
		}
		chamber[chamber.length - 1].push('|');
	}

	rock.forEach(([x, y]) => {
		chamber[y][x + 1] = '@';
	});

	console.clear();
	console.log(
		chamber
			.reverse()
			.map((row) => row.join(''))
			.join('\n')
	);
	console.log('---------');
	console.log(`Height: ${height} - Rock: ${rockCount} - Rock Index: ${rockIndex}`);
};

const getNextDirection = () => {
	let direction = jets[directionIndex % jets.length];
	directionIndex++;
	return direction;
};

let rockCount = 0;
let rockIndex = 0;
let directionIndex = 0;
let height = 0;
let totalRockCount = 2022;
let rock = createRock(rockIndex);

while (rockCount < totalRockCount) {
	let jet = getNextDirection();
	// Move direction of jet
	moved = [...rock.map(([x, y]) => [x + jet, y])];
	let hasIntersectionSolid = checkIntersectionWithSolid(moved);
	let hasIntersectionChamber = checkIntersectionWithChamber(moved);
	if (!hasIntersectionChamber && !hasIntersectionSolid) {
		rock = moved;
	}

	// Move down
	moved = [...rock.map(([x, y]) => [x, y - 1])];
	hasIntersectionSolid = checkIntersectionWithSolid(moved);

	if (hasIntersectionSolid) {
		rock.every(([x, y]) => solid.add([x, y].join(',')));
		rockCount++;
		let maxHeightSolid = Math.max(...[...solid.values()].map((v) => v.split(',')[1]));
		height = Math.max(maxHeightSolid) + 1;

		if (rockCount >= totalRockCount) {
			break;
		}

		rockIndex = (rockIndex + 1) % rocks.length;
		rock = createRock(rockIndex);
		// showChamber(rock);
		// console.log();
	} else {
		rock = moved;
	}
}

console.log(height);
