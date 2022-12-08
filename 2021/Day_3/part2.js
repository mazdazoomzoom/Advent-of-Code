const fs = require('fs');

const getInput = async () => {
	try {
		const data = fs.readFileSync('./input.txt', 'utf8');
		return data.split('\n');
	} catch (error) {
		return Promise.reject(err);
	}
};

const main = async () => {
	try {
		let inputData = await getInput();
		let oxGenRating = getOxGenRating(inputData);
		let co2ScrubRating = getCO2ScrubRating(inputData);

		console.log(`Oxygen Generator Rating: ${oxGenRating}`);
		console.log(`CO2 Scrubber Rating: ${co2ScrubRating}`);
		console.log(`Total Rating: ${oxGenRating * co2ScrubRating}`);
	} catch (error) {
		console.error(error);
	}
};

const getOxGenRating = (inputData) => {
	while (inputData.length > 1) {
		for (let col = 0; col < inputData[0].length; col++) {
			if (inputData.length == 1) {
				break;
			}

			let count0 = 0;
			let count1 = 0;
			for (let row of inputData) {
				let bit = row.charAt(col);
				bit == 0 ? count0++ : count1++;
			}

			if (count0 > count1) {
				inputData = inputData.filter((value) => value.charAt(col) == 0);
			} else {
				inputData = inputData.filter((value) => value.charAt(col) == 1);
			}
		}
	}
	return parseInt(inputData[0], 2);
};

const getCO2ScrubRating = (inputData) => {
	while (inputData.length > 1) {
		for (let col = 0; col < inputData[0].length; col++) {
			if (inputData.length == 1) {
				break;
			}

			let count0 = 0;
			let count1 = 0;
			for (let row of inputData) {
				let bit = row.charAt(col);
				bit == 0 ? count0++ : count1++;
			}

			if (count0 > count1) {
				inputData = inputData.filter((value) => value.charAt(col) == 1);
			} else {
				inputData = inputData.filter((value) => value.charAt(col) == 0);
			}
		}
	}
	return parseInt(inputData[0], 2);
};

main();
