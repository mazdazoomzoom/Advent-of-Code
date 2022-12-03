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
		let oxGenRating = [...inputData];
		let co2ScrubRating = [...inputData];

		for (let col = 0; col < inputData[0].length; col++) {
			let count0 = 0;
			let count1 = 0;
			for (let row of inputData) {
				let bit = row.charAt(col);
				if (bit == 0) count0++;
				if (bit == 1) count1++;
			}

			if (count0 > count1) {
				if (oxGenRating.length > 1) oxGenRating = oxGenRating.filter((value) => value.charAt(col) == 0);
				if (co2ScrubRating.length > 1)
					co2ScrubRating = co2ScrubRating.filter((value) => value.charAt(col) == 1);
			} else if (count0 < count1) {
				if (oxGenRating.length > 1) oxGenRating = oxGenRating.filter((value) => value.charAt(col) == 1);
				if (co2ScrubRating.length > 1)
					co2ScrubRating = co2ScrubRating.filter((value) => value.charAt(col) == 0);
			} else {
				if (oxGenRating.length > 1) oxGenRating = oxGenRating.filter((value) => value.charAt(col) == 1);
				if (co2ScrubRating.length > 1)
					co2ScrubRating = co2ScrubRating.filter((value) => value.charAt(col) == 0);
			}
		}

		console.log(parseInt(oxGenRating[0], 2) * parseInt(co2ScrubRating[0], 2));
	} catch (error) {
		console.error(error);
	}
};

main();
