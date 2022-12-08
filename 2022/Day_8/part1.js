const fs = require('fs');

const getInput = async () => {
	try {
		const data = fs.readFileSync('./input.txt', 'utf8');
		return data.split('\n');
	} catch (error) {
		console.log(error);
	}
};

const main = async () => {
	try {
		let inputData = await getInput();
		inputData = inputData.map((line) => line.split(''));

		let visibleTrees = 0;

		for (let row = 0; row < inputData.length; row++) {
			for (let col = 0; col < inputData[row].length; col++) {
				// Trees are on the edge of the grid. They are visible.
				if (row === 0 || row === inputData.length - 1 || col === 0 || col === inputData[row].length - 1) {
					visibleTrees++;
					continue;
				}

				let treeToCheck = inputData[row][col];

				// Check trees in up, down, left, and right to see if it is visible.
				let treesAbove = inputData.slice(0, row).map((row) => row[col]);
				let treesBelow = inputData.slice(row + 1).map((row) => row[col]);
				let treesLeft = inputData[row].slice(0, col);
				let treesRight = inputData[row].slice(col + 1);

				if (treesAbove.every((tree) => tree < treeToCheck)) {
					visibleTrees++;
					continue;
				}

				if (treesBelow.every((tree) => tree < treeToCheck)) {
					visibleTrees++;
					continue;
				}

				if (treesLeft.every((tree) => tree < treeToCheck)) {
					visibleTrees++;
					continue;
				}

				if (treesRight.every((tree) => tree < treeToCheck)) {
					visibleTrees++;
					continue;
				}
			}
		}

		console.log(visibleTrees);
	} catch (error) {
		console.error(error);
	}
};

main();
