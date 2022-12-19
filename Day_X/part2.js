const fs = require('fs');
const data = fs.readFileSync(runSample ? sampleInput : input, 'utf8');

const input = './input.txt';
const sampleInput = './inputSample.txt';
const runSample = true;

// Puzzle Start

let inputData = data;
