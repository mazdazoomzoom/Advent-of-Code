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

		let signalboostPoints = [20, 60, 100, 140, 180, 220];
		let signalStrengths = [];
		let cycles = 1;
		let x = 1;

		inputData.forEach((line) => {
			cycles++;
			line = line.split(' ');

			if (signalboostPoints.includes(cycles)) {
				signalStrengths.push(x * cycles);
				signalboostPoints = signalboostPoints.filter((item) => item !== cycles);
				console.log(`Signal strength at cycle ${cycles} is ${x * cycles}`);
			}

			if (line[0] === 'addx') {
				x += parseInt(line[1]);
				cycles++;
			}

			if (signalboostPoints.includes(cycles)) {
				signalStrengths.push(x * cycles);
				signalboostPoints = signalboostPoints.filter((item) => item !== cycles);
				console.log(`Signal strength at cycle ${cycles} is ${x * cycles}`);
			}
		});

		console.log(`The final signal strength is ${signalStrengths.reduce((a, b) => a + b, 0)}`);
	} catch (error) {
		console.error(error);
	}
};

main();
