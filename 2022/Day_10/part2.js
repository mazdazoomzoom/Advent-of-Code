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

		let display = new Array(6).fill(0).map(() => []);

		let cyclesRowLookup = new Array(6).fill(0).map((row, index) => {
			return new Array(40).fill(0).map((element, arrindex) => {
				return arrindex + 1 + index * 40;
			});
		});

		let cycles = 1;
		let x = 1;

		inputData.forEach((line) => {
			line = line.split(' ');
			let row = cyclesRowLookup.findIndex((row) => row.includes(cycles));
			let valueToDisplay = '';
			let tempPosition = row * 40;

			valueToDisplay = x + tempPosition === cycles || x + 1 + tempPosition === cycles || x + 2 + tempPosition == cycles ? '#' : ' ';
			display[row].push(valueToDisplay);
			cycles++;

			if (line[0] === 'addx') {
				valueToDisplay = x + tempPosition === cycles || x + 1 + tempPosition === cycles || x + 2 + tempPosition == cycles ? '#' : ' ';
				display[row].push(valueToDisplay);
				cycles++;
				x += parseInt(line[1]);
			}
		});

		console.log(`${display.map((row) => row.join('')).join('\n')}`);
	} catch (error) {
		console.error(error);
	}
};

main();
