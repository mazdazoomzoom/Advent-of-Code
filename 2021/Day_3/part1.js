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
		let gamma = '';
		let epsilon = '';
		let inputData = await getInput();

		for (let col = 0; col < inputData[0].length; col++) {
			let count0 = 0;
			let count1 = 0;
			for (let row of inputData) {
				let bit = row.charAt(col);
				if (bit == 0) count0++;
				if (bit == 1) count1++;
			}
			if (count0 > count1) {
				gamma += '0';
				epsilon += '1';
			} else {
				gamma += '1';
				epsilon += '0';
			}
		}

		console.log(parseInt(gamma, 2) * parseInt(epsilon, 2));
	} catch (error) {
		console.error(error);
	}
};

main();
