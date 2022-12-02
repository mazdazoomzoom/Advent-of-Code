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
		let horizontal = 0;
		let depth = 0;
		let aim = 0;
		let inputData = await getInput();

		while (inputData.length > 0) {
			let instructions = inputData[0].split(' ');
			switch (instructions[0]) {
				case 'forward':
					horizontal += parseInt(instructions[1]);
					depth += aim * parseInt(instructions[1]);
					break;
				case 'backward':
					horizontal -= parseInt(instructions[1]);
					break;
				case 'down':
					aim += parseInt(instructions[1]);
					break;
				case 'up':
					aim -= parseInt(instructions[1]);
					break;
			}
			inputData.shift();
		}

		console.log(horizontal * depth);
	} catch (error) {
		console.error(error);
	}
};

main();
