const PriorityQueue = require('priorityqueuejs');

const cars = new PriorityQueue((a, b) => {
  if (b.y !== a.y) return b.y - a.y;
  return b.x - a.x;
});

const SIZE = 150;
const grid = new Array(SIZE * SIZE);

const getPosition = ({x, y}) => grid[y * SIZE + x];
const setPosition = (x, y, val) => (grid[y * SIZE + x] = val);

const moveLeft = car => {
  if (car.direction.x === 0) {
    car.direction = {
      x: car.direction.y,
      y: car.direction.x,
    };
  } else {
    car.direction = {
      x: car.direction.y,
      y: car.direction.x * -1,
    };
  }
  return car;
};

const moveRight = car => {
  if (car.direction.x === 0) {
    car.direction = {
      x: car.direction.y * -1,
      y: car.direction.x,
    };
  } else {
    car.direction = {
      x: car.direction.y,
      y: car.direction.x,
    };
  }
  return car;
};

const moveCar = car => {
  car.x += car.direction.x;
  car.y += car.direction.y;
  const instruction = getPosition(car);

  if (instruction === null) return car;
  if (instruction === '+') {
    const direction = ++car.turns % 3;
    if (direction === 1) return car;
    if (direction === 0) return moveLeft(car);
    return moveRight(car);
  }

  if (instruction === '\\') {
    if (car.direction.x !== 0) return moveRight(car);
    return moveLeft(car);
  }
  if (instruction === '/') {
    if (car.direction.x !== 0) return moveLeft(car);
    return moveRight(car);
  }
};

const move = () => {
  const nCars = cars.size();
  const newCars = new Array(nCars);
  for (let i = 0; i < nCars; i++) {
    newCars[i] = moveCar(cars.deq());
  }
  for (let i = 0; i < nCars; i++) {
    cars.enq(newCars[i]);
  }
};

const removeCrashes = () => {
  const nCars = cars.size();
  const allCars = new Array(nCars);
  const alive = [];

  allCars[0] = cars.deq();
  for (let i = 1; i < nCars; i++) {
    allCars[i] = cars.deq();
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
  alive.forEach(x => cars.enq(x));
};

const findFirstCrash = () => {
  const nCars = cars.size();
  let prevCar = {x: -1, y: -1};
  const newCars = [];

  for (let i = 0; i < nCars; i++) {
    newCars[i] = cars.deq();
    if (newCars[i].x === prevCar.x && newCars[i].y === prevCar.y) {
      return prevCar;
    }
    prevCar = newCars[i];
  }
  for (let i = 0; i < nCars; i++) {
    cars.enq(newCars[i]);
  }
  return null;
};

const processInput = lines =>
  lines.forEach((line, y) =>
    line.split('').forEach((val, x) => {
      if (val === '|' || val === '-') return setPosition(x, y, null);
      if (val === '^') {
        cars.enq({x, y, turns: -1, direction: {x: 0, y: -1}});
        return setPosition(x, y, null);
      }
      if (val === 'v') {
        cars.enq({x, y, turns: -1, direction: {x: 0, y: 1}});
        return setPosition(x, y, null);
      }
      if (val === '>') {
        cars.enq({x, y, turns: -1, direction: {x: 1, y: 0}});
        return setPosition(x, y, null);
      }
      if (val === '<') {
        cars.enq({x, y, turns: -1, direction: {x: -1, y: 0}});
        return setPosition(x, y, null);
      }
      setPosition(x, y, val);
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
  } while (cars.size() > 1);
  return [cars.peek().x, cars.peek().y].join(',');
};

module.exports = [solution1, solution2];
