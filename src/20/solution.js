const Stack = require('../utils/stack');

const distances = new Map();
const groups = new Stack();
let position = {x: 0, y: 0, distance: 0};

const advance = (xDiff, yDiff) => {
  position.x += xDiff;
  position.y += yDiff;
  position.distance++;

  const key = `${position.x}-${position.y}`;
  const currentDistance = distances.get(key) || Infinity;
  if (position.distance < currentDistance) {
    distances.set(key, position.distance);
  } else position.distance = currentDistance;
};

const options = {
  N: advance.bind(null, 0, -1),
  E: advance.bind(null, 1, 0),
  S: advance.bind(null, 0, 1),
  W: advance.bind(null, -1, 0),
  '(': () => groups.push(Object.assign({}, position)),
  '|': () => (position = Object.assign({}, groups.peak())),
  ')': () => (position = groups.pop()),
};

const solve = ([rawInput]) =>
  rawInput
    .slice(1, -1)
    .split('')
    .forEach(c => options[c]());

const solution1 = () => Math.max.apply(null, [...distances.values()]);
const solution2 = () => [...distances.values()].filter(x => x >= 1000).length;

module.exports = [solution1, solution2].map(fn => x => fn(solve(x)));
