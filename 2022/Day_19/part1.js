const fs = require('fs');
const runSample = true;
let data = fs.readFileSync(runSample ? './inputSample.txt' : './input.txt', 'utf8');

/*
 * Puzzle Start
 */

const createBlueprints = (data) => {
	let blueprints = {};
	data = data.split('\n');
	for (let line of data) {
		let blueprintNumber = parseInt(line.split(': ')[0].split(' ')[1]);
		blueprints[blueprintNumber] = {};
		line = line
			.split(': ')[1]
			.split('.')
			.map((segment) => segment.trim());

		for (let segment of line) {
			if (segment == '') continue;
			let material, amount, material2, amount2, robot, robotBuild, costsIndex;

			segment = segment.split(' ');
			robot = segment[1];

			costsIndex = segment.indexOf('costs');
			segment = segment.slice(costsIndex + 1);

			material = segment[1];
			amount = parseInt(segment[0]);

			robotBuild = {
				costs: {
					[material]: amount,
				},
			};

			if (segment.indexOf('and') > -1) {
				segment = segment.slice(segment.indexOf('and') + 1);
				material2 = segment[1];
				amount2 = parseInt(segment[0]);
				robotBuild.costs[material2] = amount2;
			}

			if (material2) robotBuild.costs[material2] = amount2;
			blueprints[blueprintNumber][robot] = robotBuild;
		}
	}

	return blueprints;
};

const getBestGeodes = (blueprint, id, time) => {
	const cOreRobot = blueprint['ore'].costs['ore']; // Cost of ore robot (ore)
	const cClayRobot = blueprint['clay'].costs['ore']; // Cost of clay robot (ore)
	const cObsRobotOre = blueprint['obsidian'].costs['ore']; // Cost of obsidian robot (ore)
	const cObsRobotClay = blueprint['obsidian'].costs['clay']; // Cost of obsidian robot (clay)
	const cGeoRobotOre = blueprint['geode'].costs['ore']; // Cost of geode robot (ore)
	const cGeoRobotObs = blueprint['geode'].costs['obsidian']; // Cost of geode robot (obsidian)

	const maxOreSpend = Math.max(cOreRobot, cClayRobot, cObsRobotOre, cGeoRobotOre);

	let bestGeodeCount = 0;
	// state: ore, clay, obsidian, geodes, robotCountOre, robotCountClay, robotCountObs, robotCountGeo, time
	let state = [0, 0, 0, 0, 1, 0, 0, 0, time];
	let seen = new Set();

	let queue = [state];
	while (queue.length) {
		state = queue.shift();
		let [ore, clay, obsidian, geodes, rcOre, rcClay, rcObs, rcGeo, remTime] = state;

		bestGeodeCount = Math.max(bestGeodeCount, geodes);
		if (remTime == 0) continue;

		if (rcOre >= maxOreSpend) rcOre = maxOreSpend;
		if (rcClay >= cObsRobotClay) rcClay = cObsRobotClay;
		if (rcObs >= cGeoRobotObs) rcObs = cGeoRobotObs;

		let oreCountNeeded = remTime * maxOreSpend - rcOre * (remTime - 1);
		let clayCountNeeded = remTime * cObsRobotClay - rcClay * (remTime - 1);
		let obsCountNeeded = remTime * cGeoRobotObs - rcObs * (remTime - 1);

		if (ore >= oreCountNeeded) ore = oreCountNeeded;
		if (clay >= clayCountNeeded) clay = clayCountNeeded;
		if (obsidian >= obsCountNeeded) obsidian = obsCountNeeded;

		state = [ore, clay, obsidian, geodes, rcOre, rcClay, rcObs, rcGeo, remTime];
		let key = state.join(',');
		if (seen.has(key)) continue;
		seen.add(key);

		if (seen.size % 10000 == 0) {
			console.log(`Blueprint ID: ${id}; Time: ${time - remTime}, Best: ${bestGeodeCount}, Seen: ${seen.size / 10000}0k, Queue: ${queue.length}`);
		}

		ore += rcOre;
		clay += rcClay;
		obsidian += rcObs;
		geodes += rcGeo;
		remTime--;

		queue.push([ore, clay, obsidian, geodes, rcOre, rcClay, rcObs, rcGeo, remTime]);
		// if (rcOre >= maxOreSpend && rcClay >= cObsRobotClay && rcObs >= cGeoRobotObs) continue;

		// If we have enough ore to build a robot, build it unless we have robots for resource type
		if (ore >= cOreRobot) {
			queue.push([ore - cOreRobot, clay, obsidian, geodes, rcOre + 1, rcClay, rcObs, rcGeo, remTime]);
		}
		if (ore >= cClayRobot) {
			queue.push([ore - cClayRobot, clay, obsidian, geodes, rcOre, rcClay + 1, rcObs, rcGeo, remTime]);
		}
		if (ore >= cObsRobotOre && clay >= cObsRobotClay) {
			queue.push([ore - cObsRobotOre, clay - cObsRobotClay, obsidian, geodes, rcOre, rcClay, rcObs + 1, rcGeo, remTime]);
		}
		if (ore >= cGeoRobotOre && obsidian >= cGeoRobotObs) {
			queue.push([ore - cGeoRobotOre, clay, obsidian - cGeoRobotObs, geodes, rcOre, rcClay, rcObs, rcGeo + 1, remTime]);
		}
	}

	console.log(`Best geode count: ${bestGeodeCount} (seen: ${seen.size})`);
	return bestGeodeCount;
};

const time = 24;
let result = 0;

const blueprints = createBlueprints(data);
for (let blueprint in blueprints) {
	blueprint = parseInt(blueprint);
	result += getBestGeodes(blueprints[blueprint], blueprint, time) * blueprint;
}

console.log(`Blueprint Results: ${blueprintResults}`);
