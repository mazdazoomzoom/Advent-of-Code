const { reverse } = require('dns');
const fs = require('fs');

const getInput = async () => {
	try {
		const data = fs.readFileSync('./input.txt', 'utf8');
		return data.split('\n');
	} catch (error) {
		console.log(error);
	}
};

let maxScenicScore = 0;

const main = async () => {
	try {
		let inputData = await getInput();
		inputData = inputData.map((line) => line.split('').map((char) => parseInt(char)));

		for (let row = 0; row < inputData.length; row++) {
			for (let col = 0; col < inputData[row].length; col++) {
				if (row === 0 || row === inputData.length - 1 || col === 0 || col === inputData[row].length - 1) {
					continue;
				}

				let treeToCheck = inputData[row][col];

				// Check trees in up, down, left, and right to count how many trees are smaller than it.
				let treesAbove = inputData.slice(0, row).map((row) => row[col]);
				let treesBelow = inputData.slice(row + 1).map((row) => row[col]);
				let treesLeft = inputData[row].slice(0, col);
				let treesRight = inputData[row].slice(col + 1);

				// Count how many trees are needed to block the view of the tree.

				let treesVisableAbove = countTreesVisible(treesAbove.reverse(), treeToCheck);
				let treesVisableBelow = countTreesVisible(treesBelow, treeToCheck);
				let treesVisableLeft = countTreesVisible(treesLeft.reverse(), treeToCheck);
				let treesVisableRight = countTreesVisible(treesRight, treeToCheck);

				let scenicScore = treesVisableAbove * treesVisableBelow * treesVisableLeft * treesVisableRight;

				if (scenicScore > maxScenicScore) {
					maxScenicScore = scenicScore;
				}
			}
		}

		console.log(maxScenicScore);
	} catch (error) {
		console.error(error);
	}
};

const countTreesVisible = (trees, treeToCheck) => {
	let count = 0;
	for (let tree of trees) {
		count++;
		if (tree >= treeToCheck) {
			break;
		}
	}
	return count;
};

main();
