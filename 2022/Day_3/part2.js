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
		let sumPriorities = 0;
		let rucksackGroups = [];

		while (inputData.length > 0) {
			rucksackGroups.push(inputData.splice(0, 3));
		}

		for (let rucksackGroup of rucksackGroups) {
			let likeItem = null;
			let rucksack1 = rucksackGroup[0].split('');
			let rucksack2 = rucksackGroup[1].split('');
			let rucksack3 = rucksackGroup[2].split('');

			for (let item of rucksack1) {
				if (rucksack2.includes(item) && rucksack3.includes(item)) {
					likeItem = item;
					break;
				}
			}

			let priorityValue = likeItem.charCodeAt(0) - (likeItem === likeItem.toLowerCase() ? 96 : 38);
			sumPriorities += priorityValue;
		}
		console.log(`The sum of all priorities is ${sumPriorities}`);
	} catch (error) {
		console.error(error);
	}
};

main();
