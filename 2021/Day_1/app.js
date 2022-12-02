const fs = require('fs');

const getInput = async () => {
	try {
		const data = await fs.readFileSync('./input.txt', 'utf8');
		return data;
	} catch (error) {
		console.log(error);
	}
};

const createNewArray = (array) => {
	let newArray = [];
	while (array.length > 2) {
		newArray.push(array[0] + array[1] + array[2]);
		array.shift();
	}

	return newArray;
};

const main = async () => {
	try {
		let increased = 0;
		let inputData = await getInput();
		inputData = inputData.split('\n');
		inputData = inputData.map((item) => parseInt(item));

		inputData = createNewArray(inputData);

		while (inputData.length > 0) {
			if (inputData[0] < inputData[1]) {
				increased++;
			}
			inputData.shift();
		}

		console.log(increased);
	} catch (error) {
		console.error(error);
	}
};

main();
