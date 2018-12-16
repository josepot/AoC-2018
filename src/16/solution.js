const R = require('ramda');

let registers = [0, 0, 0, 0];
const instructions = [
  (a, b, c) => (registers[c] = registers[a] + registers[b]),
  (a, b, c) => (registers[c] = registers[a] + b),
  (a, b, c) => (registers[c] = registers[a] * registers[b]),
  (a, b, c) => (registers[c] = registers[a] * b),
  (a, b, c) => (registers[c] = registers[a] & registers[b]),
  (a, b, c) => (registers[c] = registers[a] & b),
  (a, b, c) => (registers[c] = registers[a] | registers[b]),
  (a, b, c) => (registers[c] = registers[a] | b),
  (a, b, c) => (registers[c] = registers[a]),
  (a, b, c) => (registers[c] = a),
  (a, b, c) => (registers[c] = a > registers[b] ? 1 : 0),
  (a, b, c) => (registers[c] = registers[a] > b ? 1 : 0),
  (a, b, c) => (registers[c] = registers[a] > registers[b] ? 1 : 0),
  (a, b, c) => (registers[c] = a === registers[b] ? 1 : 0),
  (a, b, c) => (registers[c] = registers[a] === b ? 1 : 0),
  (a, b, c) => (registers[c] = registers[a] === registers[b] ? 1 : 0),
];

const isCorrectSample = (parameters, before, after) => ([fn]) => {
  registers = [...before];
  fn(...parameters);
  return registers.every((x, idx) => x === after[idx]);
};

const optionPossibleInstructions = instructions.map(() => new Set());

const isSampleComplaint = ({before, execution, after}) => {
  const possibleInstructions = instructions
    .map((fn, idx) => [fn, idx])
    .filter(isCorrectSample(execution.slice(1), before, after));

  possibleInstructions.forEach(([, instructionsIdx]) =>
    optionPossibleInstructions[execution[0]].add(instructionsIdx)
  );

  return possibleInstructions.length >= 3;
};

const getSamples = lines => {
  const size = lines.length / 4;
  const result = new Array(size);

  for (let i = 0; i < size; i++) {
    const before = lines[i * 4]
      .match(/Before: \[(\d+), (\d+), (\d+), (\d+)\]/)
      .map(x => parseInt(x))
      .filter(x => !Number.isNaN(x));
    const execution = lines[i * 4 + 1].split(' ').map(x => parseInt(x));
    const after = lines[i * 4 + 2]
      .match(/After: {2}\[(\d+), (\d+), (\d), (\d)\]/)
      .map(x => parseInt(x))
      .filter(x => !Number.isNaN(x));
    result.push({before, execution, after});
  }

  return result;
};

const getCorrectOrder = () => {
  const exploreSet = new Set(R.range(0, instructions.length));
  const result = new Array(instructions.length);

  do {
    [...exploreSet]
      .map(possibleIdx => [
        [...optionPossibleInstructions[possibleIdx]],
        possibleIdx,
      ])
      .filter(([possibleInstructions]) => possibleInstructions.length === 1)
      .forEach(([[winner], idx]) => {
        optionPossibleInstructions.forEach(x => x.delete(winner));
        exploreSet.delete(idx);
        result[idx] = winner;
      });
  } while (exploreSet.size > 0);
  return result;
};

const solution1 = lines =>
  getSamples(lines.slice(0, 3160)).filter(isSampleComplaint).length;

const solution2 = lines => {
  solution1(lines);
  const order = getCorrectOrder();
  registers = [0, 0, 0, 0];

  lines
    .slice(3162)
    .map(x => x.split(' ').map(x => parseInt(x)))
    .map(([idx, ...params]) => ({idx, params}))
    .forEach(({idx, params}) => instructions[order[idx]](...params));

  return registers[0];
};

module.exports = [solution1, solution2];
