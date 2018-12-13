const SIZE = 7;
const grid = new Array(SIZE * SIZE);
const getIdx = (x, y) => y * SIZE + x;
const getPosition = ({x, y}) => grid[getIdx(x, y)];
const setPosition = (x, y, val) => (grid[getIdx(x, y)] = val);

let cars = [];

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
    return (direction === 0 ? turnLeft : turnRight)(car);
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

const compareCars = (a, b) => {
  if (a.y !== b.y) return a.y - b.y;
  return a.x - b.x;
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

      cars.push({x, y, turns: -1, direction});
      setPosition(x, y, null);
    })
  );

const solution1 = lines => {
  processInput(lines);
  cars.sort(compareCars);
  let firstCrash;
  do {
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
