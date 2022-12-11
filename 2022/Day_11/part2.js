const fs = require('fs');

const getInput = async () => {
	try {
		const data = fs.readFileSync('./input.txt', 'utf8');
		// const data = fs.readFileSync('./inputSample.txt', 'utf8');
		return data.split('\n\n');
	} catch (error) {
		console.log(error);
	}
};

const main = async () => {
	try {
		let inputData = await getInput();

		let monkeys = inputData.map((monkey) => {
			monkey = monkey.split('\n');
			let monkeyName = monkey[0].split(' ')[1].replace(':', '');
			let monkeyItems = monkey[1]
				.split(':')[1]
				.split(', ')
				.map((item) => parseInt(item));
			let monkeyOperations = monkey[2].split('old')[1].split(' ');
			let monkeyTest = parseInt(monkey[3].split('by')[1]);
			let monkeyTestTrue = parseInt(monkey[4].split('monkey')[1]);
			let monkeyTestFalse = parseInt(monkey[5].split('monkey')[1]);

			return (monkey = {
				name: monkeyName,
				items: monkeyItems,
				operations: {
					operator: monkeyOperations[1],
					operand: parseInt(monkeyOperations[2]),
				},
				test: {
					condition: monkeyTest,
					true: monkeyTestTrue,
					false: monkeyTestFalse,
				},
				inspectedItems: 0,
			});
		});

		let decreaseWorryLevel = 1;
		monkeys.map((monkey) => {
			decreaseWorryLevel *= monkey.test.condition;
		});

		let run = 1;
		while (run <= 10000) {
			for (let monkeyIndex = 0; monkeyIndex < monkeys.length; monkeyIndex++) {
				let monkey = monkeys[monkeyIndex];
				monkey.items.map((item) => {
					monkey.inspectedItems++;

					switch (monkey.operations.operator) {
						case '+':
							item += monkey.operations.operand;
							break;
						case '-':
							item -= monkey.operations.operand;
							break;
						case '*':
							if (isNaN(monkey.operations.operand)) {
								item *= item;
							} else {
								item *= monkey.operations.operand;
							}
							break;
						case '/':
							item /= monkey.operations.operand;
							break;
						default:
							break;
					}

					// item = item % decreaseWorryLevel;
					item = item % 1000000000;

					let monkeyTest = item % monkey.test.condition;
					if (monkeyTest === 0) {
						monkeys[monkey.test.true].items.push(item);
					} else {
						monkeys[monkey.test.false].items.push(item);
					}
				});

				monkey.items = [];
				monkeys[monkeyIndex] = monkey;
			}

			if (run % 1000 === 0 || run === 1 || run == 20) {
				console.log(`=== After round ${run} ===`);
				monkeys.map((monkey) => {
					console.log(`Monkey ${monkey.name} inspected ${monkey.inspectedItems} items`);
				});
				console.log();
			}
			run++;
		}

		// From monkeys array, get the two monkeys with the most items inspected
		let mostInspected = monkeys.sort((a, b) => b.inspectedItems - a.inspectedItems);
		console.log(`The monkey with the most items inspected is ${mostInspected[0].name} with ${mostInspected[0].inspectedItems} items inspected.`);
		console.log(`The monkey with the second most items inspected is ${mostInspected[1].name} with ${mostInspected[1].inspectedItems} items inspected.`);

		let result = mostInspected[0].inspectedItems * mostInspected[1].inspectedItems;

		console.log(result);
	} catch (error) {
		console.error(error);
	}
};

main();
