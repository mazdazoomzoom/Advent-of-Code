const fs = require('fs');

const getInput = async () => {
	try {
		const data = fs.readFileSync('./input.txt', 'utf8');
		return data;
	} catch (error) {
		console.log(error);
	}
};

const main = async () => {
	try {
		let inputData = await getInput();

		// Search inputData for the first 4 unique characters
		// Return the index of the last character in the 4 unique characters

		for (let startingIndex = 0; startingIndex < inputData.length - 4; startingIndex++) {
			let chars = inputData.substring(startingIndex, startingIndex + 4).split('');
			let uniqueChars = [...new Set(chars)];

			if (uniqueChars.length === 4) {
				console.log(startingIndex + 4);
				break;
			}
		}
	} catch (error) {
		console.error(error);
	}
};

main();
