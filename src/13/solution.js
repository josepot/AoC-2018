const {doubleCircularLinkedList} = require('../utils/linkedLists');

let N_COLS;
let N_ROWS;
let grid;

const getIdx = (x, y) => y * N_COLS + x;
const getPosition = ({x, y}, from = grid) => from[getIdx(x, y)];
const setPosition = (x, y, val, to = grid) => (to[getIdx(x, y)] = val);

let cars = [];

const [UP, RIGHT, DOWN, LEFT] = ['^', '>', 'v', '<'];
const directions = [UP, RIGHT, DOWN, LEFT];
const linkedDirections = doubleCircularLinkedList(directions);
const directionDiffs = {
  [UP]: {y: -1, x: 0},
  [DOWN]: {y: 1, x: 0},
  [LEFT]: {y: 0, x: -1},
  [RIGHT]: {y: 0, x: 1},
};

const processInput = lines => {
  N_ROWS = lines.length;
  N_COLS = lines[0].length;
  grid = new Array(N_COLS * N_ROWS);
  lines.forEach((line, y) =>
    line.split('').forEach((val, x) => {
      if (val === '|' || val === '-') return setPosition(x, y, '·');
      const directionIdx = directions.indexOf(val);
      if (directionIdx === -1) return setPosition(x, y, val);

      cars.push({x, y, turns: -1, direction: linkedDirections[directionIdx]});
      setPosition(x, y, '·');
    })
  );
};

const print = () => {
  console.log('');
  const copy = grid.slice(0);
  cars.forEach(({x, y, direction}) => {
    setPosition(x, y, direction.value, copy);
  });

  copy
    .reduce((acc, val, idx) => {
      const x = idx % N_COLS;
      if (x === 0) {
        acc.push([val]);
        return acc;
      }
      acc[acc.length - 1].push(val);
      return acc;
    }, [])
    .map(chars => chars.join(''))
    .forEach(line => console.log(line));
  console.log('');
};

const [turnLeft, turnRight] = ['prev', 'next'].map(direction => car => {
  car.direction = car.direction[direction];
  return car;
});

const instructions = {
  '+': car => {
    const direction = ++car.turns % 3;
    if (direction === 1) return car;
    return (direction === 0 ? turnLeft : turnRight)(car);
  },
  '\\': car =>
    ([UP, DOWN].indexOf(car.direction.value) > -1 ? turnLeft : turnRight)(car),
  '/': car =>
    ([UP, DOWN].indexOf(car.direction.value) > -1 ? turnRight : turnLeft)(car),
  '·': car => car,
};

const moveCar = car => {
  const {x, y} = directionDiffs[car.direction.value];
  car.x += x;
  car.y += y;

  return instructions[getPosition(car)](car);
};

const compareCars = (a, b) => getIdx(a.x, a.y) - getIdx(b.x, b.y);

const solution1 = lines => {
  processInput(lines);
  let firstCrash;
  do {
    // print();
    cars = cars.map(moveCar).sort(compareCars);
    firstCrash = cars
      .slice(1)
      .find((c, idx) => compareCars(c, cars[idx]) === 0);
  } while (!firstCrash);
  return [firstCrash.x, firstCrash.y].join(',');
};

const solution2 = lines => {
  processInput(lines);
  do {
    cars = Object.values(
      cars.map(moveCar).reduce((acc, car) => {
        const idx = getIdx(car.x, car.y);
        const currentCars = acc[idx] || [];
        currentCars.push(car);
        acc[idx] = currentCars;
        return acc;
      }, {})
    )
      .filter(x => x.length === 1)
      .reduce((acc, [car]) => {
        acc.push(car);
        return acc;
      }, []);
  } while (cars.length > 1);
  return [cars[0].x, cars[0].y].join(',');
};

module.exports = [solution1, solution2];
