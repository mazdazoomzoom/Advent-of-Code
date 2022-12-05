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

		// Seperate instructions
		let blankLineIndex = inputData.findIndex((line) => line.length === 0);
		let instructions = inputData.splice(blankLineIndex + 1, inputData.length);

		// Create Boxes Array with all boxes
		let boxesArray = [];
		let lineWithColumnNumberIndex = inputData.findIndex((line) => line.split('')[1] === '1');

		inputData[lineWithColumnNumberIndex].split('').map((char, index) => {
			if (!isNaN(parseInt(char))) {
				let columnBoxes = [];
				for (let i = 0; i < lineWithColumnNumberIndex; i++) {
					if (inputData[i].split('')[index] !== ' ') {
						columnBoxes.push(inputData[i].split('')[index]);
					}
				}
				boxesArray.push(columnBoxes);
			}
		});

		for (let instruction of instructions) {
			// Example instruction: move 3 boxes from column 1 to column 2
			let countToMove = parseInt(instruction.split(' ')[1]);
			let start = parseInt(instruction.split(' ')[3]) - 1;
			let end = parseInt(instruction.split(' ')[5]) - 1;

			boxesArray[end] = [...boxesArray[start].splice(0, countToMove), ...boxesArray[end]];
		}
		let returnString = '';
		boxesArray = boxesArray.map((column) => {
			returnString += column[0];
		});

		console.log(returnString);
	} catch (error) {
		console.error(error);
	}
};

main();
