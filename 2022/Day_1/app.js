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
		let outputArray = [];

		while (inputData.includes('')) {
			let index = inputData.indexOf('');
			let firstArray = inputData.slice(0, index);
			inputData = inputData.slice(index + 1, inputData.length);
			outputArray.push(firstArray);
		}

		outputArray = outputArray.map((array) => {
			return array.reduce((partialSum, a) => partialSum + parseInt(a), 0);
		});

		outputArray.sort((a, b) => b - a);

		console.log(outputArray[0] + outputArray[1] + outputArray[2]);
	} catch (error) {
		console.error(error);
	}
};

main();
