const R = require('ramda');

const N_ROWS = 50;
const N_COLS = 50;
let grid = new Array(N_ROWS);
for (let i = 0; i < N_ROWS; i++) grid[i] = new Array(N_COLS);

const patterns = new Map();

const getNeighbours = (x, y) =>
  [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]
    .map(([xDiff, yDiff]) => [x + xDiff, y + yDiff])
    .filter(([x, y]) => x > -1 && y > -1 && x < N_COLS && y < N_COLS)
    .map(([x, y]) => grid[y][x]);

const options = {
  '.': neighbours =>
    neighbours.filter(x => x === '|').length >= 3 ? '|' : '.',
  '|': neighbours =>
    neighbours.filter(x => x === '#').length >= 3 ? '#' : '|',
  '#': neighbours =>
    neighbours.filter(x => x === '#').length >= 1 &&
    neighbours.filter(x => x === '|').length >= 1
      ? '#'
      : '.',
};

const getGridId = grid => grid.reduce((acc, line) => acc + line.join(''), '');

const turn = () => {
  grid = grid.map((line, y) =>
    line.map((val, x) => {
      const nei = getNeighbours(x, y);
      return options[val](nei);
    })
  );
};

const findCycle = () => {
  for (let i = 0; i < 1000000000; i++) {
    turn();
    const id = getGridId(grid);
    if (patterns.has(id)) return [patterns.get(id), i];
    patterns.set(id, i);
  }
};

const parseInput = lines =>
  lines.forEach((line, y) =>
    line.split('').forEach((c, x) => {
      grid[y][x] = c;
    })
  );

const countType = type => {
  return grid.reduce(
    (acc, line) =>
      acc + line.reduce((acc2, v) => (v === type ? acc2 + 1 : acc2), 0),
    0
  );
};

const solution1 = lines => {
  parseInput(lines);
  for (let i = 0; i < 10; i++) turn(i);
  return countType('|') * countType('#');
};

const solution2 = lines => {
  parseInput(lines);
  const [from, to] = findCycle();
  const period = to - from;
  const left = (1000000000 - from) % period;
  parseInput(lines);
  for (let i = 0; i < from + left; i++) turn(i);
  return countType('|') * countType('#');
};

module.exports = [solution1, solution2];
