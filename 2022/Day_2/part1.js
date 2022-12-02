const fs = require('fs');

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;

const getInput = async () => {
	try {
		const data = fs.readFileSync('./input.txt', 'utf8');
		return data.split('\n');
	} catch (error) {
		console.log(error);
	}
};

const getPlayerValues = (playerValues) => {
	playerValues = playerValues.map((a) => {
		switch (a) {
			case 'A':
			case 'X':
				a = ROCK;
				break;
			case 'B':
			case 'Y':
				a = PAPER;
				break;
			case 'C':
			case 'Z':
				a = SCISSORS;
				break;
		}
		return a;
	});
	return playerValues;
};

const getWinner = (round) => {
	let player1 = round[0];
	let player2 = round[1];

	if (player1 === player2) {
		return 'Tie';
	} else if (player1 === ROCK) {
		if (player2 === PAPER) {
			return 'Player 2';
		} else {
			return 'Player 1';
		}
	} else if (player1 === PAPER) {
		if (player2 === SCISSORS) {
			return 'Player 2';
		} else {
			return 'Player 1';
		}
	} else if (player1 === SCISSORS) {
		if (player2 === ROCK) {
			return 'Player 2';
		} else {
			return 'Player 1';
		}
	}
};

const main = async () => {
	try {
		let score = 0;

		let inputData = await getInput();
		inputData = inputData.map((a) => {
			a = a.split(' ');
			a = getPlayerValues(a);
			return a;
		});

		inputData.map((round) => {
			roundResults = getWinner(round);

			switch (roundResults) {
				case 'Player 1':
					score += round[1] + 0;
					break;
				case 'Player 2':
					score += round[1] + 6;
					break;
				case 'Tie':
					score += round[1] + 3;
					break;
			}
		});

		console.log(score);
	} catch (error) {
		console.error(error);
	}
};

main();
