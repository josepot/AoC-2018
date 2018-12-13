const PriorityQueue = require('priorityqueuejs');

const SIZE = 150;
const grid = new Array(SIZE * SIZE);
const getPosition = ({x, y}) => grid[y * SIZE + x];
const setPosition = (x, y, val) => (grid[y * SIZE + x] = val);

const cars = new PriorityQueue((a, b) => {
  if (b.y !== a.y) return b.y - a.y;
  return b.x - a.x;
});
const [push, pop, peek, len] = ['enq', 'deq', 'peek', 'size'].map(fnName =>
  cars[fnName].bind(cars)
);

const turn = left => {
  const [a, b] = left ? ['x', 'y'] : ['y', 'x'];
  return car => {
    const multiplier = car.direction[a] === 0 ? 1 : -1;
    car.direction = {
      [a]: car.direction[b],
      [b]: car.direction[a] * multiplier,
    };
    return car;
  };
};
const [turnLeft, turnRight] = [true, false].map(turn);

const intructions = {
  '+': car => {
    const direction = ++car.turns % 3;
    if (direction === 1) return car;
    if (direction === 0) return turnLeft(car);
    return turnRight(car);
  },
  '\\': car => (car.direction.x === 0 ? turnLeft : turnRight)(car),
  '/': car => (car.direction.x === 0 ? turnRight : turnLeft)(car),
};

const moveCar = car => {
  car.x += car.direction.x;
  car.y += car.direction.y;

  const instruction = getPosition(car);
  return instruction === null ? car : intructions[instruction](car);
};

const move = () => {
  const nCars = len();
  const nextCars = new Array(nCars);

  for (let i = 0; i < nCars; i++) nextCars[i] = moveCar(pop());
  nextCars.forEach(push);
};

const removeCrashes = () => {
  const nCars = len();
  const allCars = new Array(nCars);
  const alive = [];

  allCars[0] = pop();
  for (let i = 1; i < nCars; i++) {
    allCars[i] = pop();
    if (
      allCars[i].x !== allCars[i - 1].x ||
      allCars[i].y !== allCars[i - 1].y
    ) {
      alive.push(allCars[i]);
    }
  }
  if (allCars[0].x !== allCars[1].x || allCars[0].y !== allCars[1].y) {
    alive.push(allCars[0]);
  }
  alive.forEach(push);
};

const findFirstCrash = () => {
  const nCars = len();
  let prevCar = {x: -1, y: -1};
  const newCars = [];

  for (let i = 0; i < nCars; i++) {
    newCars[i] = pop();
    if (newCars[i].x === prevCar.x && newCars[i].y === prevCar.y) {
      return prevCar;
    }
    prevCar = newCars[i];
  }
  newCars.forEach(push);
  return null;
};

const directions = {
  '^': {x: 0, y: -1},
  v: {x: 0, y: 1},
  '>': {x: 1, y: 0},
  '<': {x: -1, y: 0},
};
const processInput = lines =>
  lines.forEach((line, y) =>
    line.split('').forEach((val, x) => {
      if (val === '|' || val === '-') return setPosition(x, y, null);

      const direction = directions[val];
      if (!direction) return setPosition(x, y, val);

      push({x, y, turns: -1, direction});
      setPosition(x, y, null);
    })
  );

const solution1 = lines => {
  processInput(lines);
  let firstCrash;
  do {
    move();
    firstCrash = findFirstCrash();
  } while (firstCrash === null);
  return [firstCrash.x, firstCrash.y].join(',');
};

const solution2 = lines => {
  processInput(lines);
  do {
    move();
    removeCrashes();
  } while (len() > 1);
  return [peek().x, peek().y].join(',');
};

module.exports = [solution1, solution2];
