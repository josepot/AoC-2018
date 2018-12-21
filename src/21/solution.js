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

let latest;
const set = new Set();
const ipEnhancer = (fnIdx, args, isSolution1 = true) => () => {
  instructions[fnIdx](...args);
  if (instructionNames[fnIdx] === 'gtir' && registers[5] === 1) {
    if (isSolution1) {
      throw registers[4];
    } else if (set.has(registers[4])) {
      throw latest;
    }
    latest = registers[4];
    set.add(latest);
  }
  registers[ip]++;
};

const solution = isSolution1 => lines => {
  ip = parseInt(lines[0].split(' ')[1], 10);
  const fns = lines.slice(1).map(line => {
    const [name, ...vals] = line.split(' ');
    return ipEnhancer(
      instructionNames.indexOf(name),
      vals.map(x => parseInt(x, 10)),
      isSolution1
    );
  });
  try {
    while (registers[ip] < fns.length) {
      fns[registers[ip]]();
    }
  } catch (e) {
    return e;
  }
};

module.exports = [solution(true), solution(false)];
