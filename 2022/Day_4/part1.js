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

		let count = 0;
		inputData.forEach((line) => {
			let lineArray = line.split(',').map((item) => item.split('-').map((number) => parseInt(number)));

			lineArray = lineArray.sort((a, b) => {
				if (a[0] < b[0]) {
					return -1;
				} else if (a[0] > b[0]) {
					return 1;
				} else if (a[1] > b[1]) {
					return -1;
				} else if (a[1] < b[1]) {
					return 1;
				} else {
					return 0;
				}
			});

			if (lineArray[0][1] >= lineArray[1][1]) {
				count++;
			}
		});
		console.log(count);
	} catch (error) {
		console.error(error);
	}
};

main();
