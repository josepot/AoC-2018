const {
  doubleCircularLinkedList,
  circularLinkedList,
} = require('../utils/linkedLists');

let N_COLS;
let N_ROWS;
let grid;

const getIdx = (x, y) => y * N_COLS + x;
const getPosition = ({x, y}, from = grid) => from[getIdx(x, y)];
const setPosition = (x, y, val, to = grid) => (to[getIdx(x, y)] = val);

let cars = new Map();

const [UP, RIGHT, DOWN, LEFT] = ['^', '>', 'v', '<'];
const directions = [UP, RIGHT, DOWN, LEFT];
const linkedDirections = doubleCircularLinkedList(directions);
const directionDiffs = {
  [UP]: {y: -1, x: 0},
  [DOWN]: {y: 1, x: 0},
  [LEFT]: {y: 0, x: -1},
  [RIGHT]: {y: 0, x: 1},
};

const [turnLeft, turnRight] = ['prev', 'next'].map(direction => car => {
  car.direction = car.direction[direction];
});

const linkedIntersections = circularLinkedList([
  turnLeft,
  Function.prototype,
  turnRight,
]);

const processInput = lines => {
  N_ROWS = lines.length;
  N_COLS = lines[0].length;
  grid = new Array(N_COLS * N_ROWS);
  lines.forEach((line, y) =>
    line.split('').forEach((val, x) => {
      if (val === '|' || val === '-') return setPosition(x, y, '·');
      const directionIdx = directions.indexOf(val);
      if (directionIdx === -1) return setPosition(x, y, val);

      cars.set(getIdx(x, y), {
        x,
        y,
        onIntersection: linkedIntersections[0],
        direction: linkedDirections[directionIdx],
      });
      setPosition(x, y, '·');
    })
  );
};

const instructions = {
  '+': car => {
    car.onIntersection.value(car);
    car.onIntersection = car.onIntersection.next;
  },
  '\\': car =>
    ([UP, DOWN].indexOf(car.direction.value) > -1 ? turnLeft : turnRight)(car),
  '/': car =>
    ([UP, DOWN].indexOf(car.direction.value) > -1 ? turnRight : turnLeft)(car),
  '·': Function.prototype,
};

const moveCar = car => {
  const {x, y} = directionDiffs[car.direction.value];
  car.x += x;
  car.y += y;
  instructions[getPosition(car)](car);
};

const solution1 = lines => {
  processInput(lines);
  do {
    const sortedKeys = [...cars.keys()].sort((a, b) => a - b);

    for (let i = 0; i < sortedKeys.length; i++) {
      const key = sortedKeys[i];
      const car = cars.get(key);
      cars.delete(key);
      moveCar(car);
      const id = getIdx(car.x, car.y);
      if (cars.has(id)) return [car.x, car.y].join(',');
      cars.set(id, car);
    }
  } while (true);
};

const solution2 = lines => {
  processInput(lines);
  do {
    const sortedKeys = [...cars.keys()].sort((a, b) => a - b);

    for (let i = 0; i < sortedKeys.length; i++) {
      const key = sortedKeys[i];
      const car = cars.get(key);
      if (!car) continue;
      cars.delete(key);
      moveCar(car);
      const id = getIdx(car.x, car.y);
      if (!cars.has(id)) {
        cars.set(id, car);
      } else {
        cars.delete(id);
      }
    }
  } while (cars.size > 1);
  const [winner] = cars.values();
  return [winner.x, winner.y].join(',');
};

module.exports = [solution1, solution2];
