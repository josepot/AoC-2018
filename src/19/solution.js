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

let registers = [0, 0, 0, 0, 0, 0];

let ip;
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
const ipEnhancer = (fnIdx, args) => () => {
  // console.log(instructionNames[fnIdx], ...args);
  // console.log(registers);
  instructions[fnIdx](...args);
  registers[ip]++;
  // console.log(registers);
  // console.log();
};

const solution1 = lines => {
  ip = parseInt(lines[0].split(' ')[1], 10);
  const fns = lines.slice(1).map(line => {
    const [name, ...vals] = line.split(' ');
    return ipEnhancer(
      instructionNames.indexOf(name),
      vals.map(x => parseInt(x, 10))
    );
  });
  while (registers[ip] < fns.length) {
    fns[registers[ip]]();
  }
  return registers;
};

const solution2 = () => {
  /*
do {
  registers[2] = 1;
  do {
    if (registers[2] === registers[4] / registers[5]) {
      registers[0] += registers[5];
    }
    registers[2]++;
  } while (registers[2] <= registers[4]);
  registers[5]++;
} while (registers[5] <= registers[4]);
*/
  registers = [0, 2, 0, null, 10551306, 1];
  do {
    if (registers[4] % registers[5] === 0) {
      registers[0] += registers[5];
    }
    registers[5]++;
  } while (registers[5] <= registers[4]);
  return registers[0];
};

module.exports = [solution1, solution2];
