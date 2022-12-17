const fs = require('fs');

const input = './input.txt';
const sampleInput = './inputSample.txt';
const runSample = false;

const getInput = async () => {
	try {
		const data = fs.readFileSync(runSample ? sampleInput : input, 'utf8');
		return data.split('\n');
	} catch (error) {
		console.log(error);
	}
};

const main = async () => {
	try {
		let inputData = await getInput();
	} catch (error) {
		console.error(error);
	}
};

main();
