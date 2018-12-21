const {compose: c} = require('ramda');
const Stack = require('../utils/stack');

const openDoors = new Map();
const distances = new Map([['0,0', 0]]);
const groups = new Stack();
let position = {x: 0, y: 0};

const addDoor = ({x, y}, xDiff, yDiff) => {
  const positionKey = `${x},${y}`;
  const doorKey = `${xDiff},${yDiff}`;
  if (!openDoors.has(positionKey)) openDoors.set(positionKey, new Set());
  openDoors.get(positionKey).add(doorKey);
};

const advance = (xDiff, yDiff) => {
  addDoor(position, xDiff, yDiff);
  position.x += xDiff;
  position.y += yDiff;
  addDoor(position, xDiff * -1, yDiff * -1);
};

const options = {
  N: advance.bind(null, 0, -1),
  E: advance.bind(null, 1, 0),
  S: advance.bind(null, 0, 1),
  W: advance.bind(null, -1, 0),
  '(': () => groups.push(Object.assign({}, position)),
  '|': () => (position = Object.assign({}, groups.peek())),
  ')': () => (position = groups.pop()),
};

const buildGrid = ([rawInput]) =>
  rawInput
    .slice(1, -1)
    .split('')
    .forEach(c => options[c]());

const setDistances = () => {
  let unexplored = [`0,0`];
  let distance = 1;
  let nextUnexplored = [];
  do {
    unexplored.forEach(positionId => {
      const available = [...openDoors.get(positionId)]
        .map(door => {
          const [xDiff, yDiff] = door.split(',').map(x => parseInt(x, 10));
          const [x, y] = positionId.split(',').map(x => parseInt(x, 10));
          return `${x + xDiff},${y + yDiff}`;
        })
        .filter(id => !distances.has(id));
      nextUnexplored.push.apply(nextUnexplored, available);
      available.forEach(id => distances.set(id, distance));
    });
    unexplored = nextUnexplored;
    nextUnexplored = [];
    distance++;
  } while (unexplored.length > 0);
};

const solve = c(setDistances, buildGrid);

const solution1 = () => Math.max.apply(null, [...distances.values()]);
const solution2 = () => [...distances.values()].filter(x => x >= 1000).length;

module.exports = [solution1, solution2].map(fn => c(fn, solve));
