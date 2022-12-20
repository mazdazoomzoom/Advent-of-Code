const fs = require('fs');
const runSample = false;
let data = fs.readFileSync(runSample ? './inputSample.txt' : './input.txt', 'utf8');

/*
 * Puzzle Start
 */

const dfs = (blueprint, maxSpend, cache, time, bots, amount) => {
	if (time == 0) return amount[3];

	key = [time, ...bots, ...amount].join(',');
	if (key in cache) return cache[key];

	maxVal = amount[3] + bots[3] * time;

	for (let [botType, recipe] of blueprint.entries()) {
		if (botType !== 3 && bots[botType] >= maxSpend[botType]) {
			continue;
		}

		let wait = 0;
		let completedRun = true;
		for (const [resourceAmount, resourceType] of recipe) {
			if (bots[resourceType] == 0) {
				completedRun = false;
				break;
			}
			wait = Math.max(wait, Math.ceil((resourceAmount - amount[resourceType]) / bots[resourceType]));
		}
		if (completedRun) {
			let remTime = time - wait - 1;
			if (remTime <= 0) continue;

			const bots_ = [...bots];
			const amount_ = amount.map((x, i) => x + bots[i] * (wait + 1));

			for (const [resourceAmount, resourceType] of recipe) {
				amount_[resourceType] -= resourceAmount;
			}

			bots_[botType] += 1;
			for (let i = 0; i < 3; i++) {
				amount_[i] = Math.min(amount_[i], maxSpend[i] * remTime);
			}

			maxVal = Math.max(maxVal, dfs(blueprint, maxSpend, cache, remTime, bots_, amount_));
		}
	}

	cache[key] = maxVal;
	return maxVal;
};

let total = 1;

let usableBlueprints = data.split('\n').slice(0, 3);
usableBlueprints.forEach((line, i) => {
	blueprint = [];
	maxSpend = [0, 0, 0];
	for (let section of line.split(': ')[1].split('. ')) {
		let recipe = [];

		// Use RegExp to find all numbers and words
		let matches = section.matchAll(/(\d+) (\w+)/g);
		for (let match of matches) {
			let [, x, y] = match;
			x = parseInt(x);
			y = ['ore', 'clay', 'obsidian'].indexOf(y);
			recipe.push([x, y]);
			maxSpend[y] = Math.max(maxSpend[y], x);
		}
		blueprint.push(recipe);
	}
	v = dfs(blueprint, maxSpend, {}, 32, [1, 0, 0, 0], [0, 0, 0, 0]);
	total *= v;
});

console.log(total);
