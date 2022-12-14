const fs = require('fs');

const getInput = async () => {
	try {
		const data = fs.readFileSync('./input.txt', 'utf8');
		// const data = fs.readFileSync('./inputSample.txt', 'utf8');

		return data.split('\n\n').map((pair) => pair.split('\n').map((item) => JSON.parse(item)));
	} catch (error) {
		console.log(error);
	}
};

const main = async () => {
	let startTime = performance.now();
	try {
		let inputData = await getInput();

		let sumOfIndices = 0;
		for (let index = 0; index < inputData.length; index++) {
			if (comparePackets(inputData[index])) sumOfIndices += index + 1;
		}

		console.log(sumOfIndices);
	} catch (error) {
		console.error(error);
	}

	let endTime = performance.now();
	console.log(`Call to complete took ${endTime - startTime} milliseconds`);
};

const comparePackets = (packets) => {
	let packet1 = packets[0];
	let packet2 = packets[1];

	// console.log(`Comparing packets...`);
	// console.log(JSON.stringify(packet1));
	// console.log(JSON.stringify(packet2));
	// console.log();

	for (let i = 0; i < packet1.length; i++) {
		let val1 = packet1[i];
		let val2 = packet2[i];

		if (!packet2[i]) return false;

		if (Array.isArray(val1) || Array.isArray(val2)) {
			if (!Array.isArray(val1)) val1 = [val1];
			if (!Array.isArray(val2)) val2 = [val2];

			let nestedArray = comparePackets([val1, val2]);
			if (nestedArray == null) continue;
			return nestedArray;
		}

		if (val1 < val2) return true;
		if (val1 > val2) return false;
	}
	if (packet1.length < packet2.length) return true;
	return null;
};

main();
