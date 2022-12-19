const fs = require('fs');
const runSample = true;
const data = fs.readFileSync(runSample ? './inputSample.txt' : './input.txt', 'utf8');

/*
 * Puzzle Start
 */

let inputData = data;
