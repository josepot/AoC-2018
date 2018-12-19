const R = require('ramda');

const instructionNames = [
  'addr',
  'addi',
  'mulr',
  'muli',
  'banr',
  'bani',
  'borr',
  'bori',
  'setr',
  'seti',
  'gtir',
  'gtri',
  'gtrr',
  'eqir',
  'eqri',
  'eqrr',
];

const registers = [1, 0, 0, 0, 0, 0];
let ip;
const ipEnhancer = fn => (...args) => {
  fn(...args);
  // tracker.push(registers[ip]);
  // tracker.splice(0, 1);
  // if (tracker.join('') === '234578910' && count++ === 100) {
  //  throw null;
  // }
  registers[ip]++;
  console.log(registers);
};

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

const solution1 = lines => {
  ip = parseInt(lines[0].split(' ')[1], 10);
  const fns = lines.slice(1).map(line => {
    const [name, ...vals] = line.split(' ');
    const idx = instructionNames.indexOf(name);

    return ipEnhancer(instructions[idx]).bind(
      null,
      ...vals.map(x => parseInt(x, 10))
    );
  });
  while (registers[ip] < fns.length) {
    fns[registers[ip]]();
  }
  return registers;
};

const solution2 = lines => {
  return lines;
};

module.exports = [solution1, solution2];
