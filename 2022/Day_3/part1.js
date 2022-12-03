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

		for (let rucksack of inputData) {
			let likeItem = null;
			let rucksackContent = rucksack.split('');
			compartment1 = rucksack.split('').slice(0, rucksackContent.length / 2);
			compartment2 = rucksack.split('').slice(rucksackContent.length / 2);

			for (let item of compartment1) {
				if (compartment2.includes(item)) {
					likeItem = item;
					break;
				}
			}

			let priorityValue = likeItem.charCodeAt(0) - (likeItem === likeItem.toLowerCase() ? 96 : 38);
			console.log(`The like item is ${likeItem} and its value is ${priorityValue}.  The character code is ${likeItem.charCodeAt(0)}`);
			sumPriorities += priorityValue;
		}
		console.log(`The sum of all priorities is ${sumPriorities}`);
	} catch (error) {
		console.error(error);
	}
};

main();
