const Stack = require('../utils/stack');

const distances = new Map([['0-0', 0]]);
const groups = new Stack();

let position = {x: 0, y: 0, distance: 0};
groups.push(Object.assign({}, position));
distances.set('0-0', 0);

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

const solution1 = ([rawInput]) => {
  rawInput
    .slice(1, -1)
    .split('')
    .forEach(c => options[c]());

  return Math.max.apply(null, [...distances.values()]);
};

const solution2 = ([rawInput]) => {
  rawInput
    .slice(1, -1)
    .split('')
    .forEach(c => options[c]());
  return [...distances.values()].filter(x => x >= 1000).length;
};

module.exports = [solution1, solution2];
