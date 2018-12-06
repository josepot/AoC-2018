const {
  max,
  split,
  map,
  compose: c,
  pipe,
  reduce,
  omit,
  values,
} = require('ramda');

const getCoordinates = pipe(
  c(map(parseInt), split(', ')),
  ([x, y]) => ({x, y})
);

const getGridInfo = lines => {
  const right = lines.reduce((acc, {x}) => (x > acc ? x : acc), 0);
  const left = lines.reduce((acc, {x}) => (x < acc ? x : acc), Infinity);
  const top = lines.reduce((acc, {y}) => (y < acc ? y : acc), Infinity);
  const bottom = lines.reduce((acc, {y}) => (y > acc ? y : acc), 0);

  return {
    starts: {x: left, y: top},
    cols: right - left + 1,
    rows: bottom - top + 1,
  };
};
const getDistance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const getWinner_ = coordinates => i =>
  coordinates.reduce(
    (acc, current, idx) => {
      const distance = getDistance(i, current);
      if (distance < acc.distance) return {distance, idx};
      return distance === acc.distance ? {distance, idx: null} : acc;
    },
    {distance: Infinity}
  ).idx;

const solution1 = rawCoordinates => {
  const {starts, cols, rows} = getGridInfo(rawCoordinates);
  const coordinates = rawCoordinates.map(({x, y}) => ({
    x: x - starts.x,
    y: y - starts.y,
  }));

  const getWinner = getWinner_(coordinates);
  const squares = new Array(cols * rows);

  const infiniteOnes = new Set();
  let i = 0;
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const winner = getWinner({x, y});
      if (x === 0 || y === 0 || x === cols - 1 || y === rows - 1) {
        infiniteOnes.add(winner);
      }
      squares[i++] = winner;
    }
  }

  return pipe(
    reduce((acc, winner) => {
      if (winner === null) return acc;
      acc[winner] = (acc[winner] || 0) + 1;
      return acc;
    }, {}),
    omit([...infiniteOnes]),
    values,
    reduce(max, 0)
  )(squares);
};

const solution2 = rawCoordinates => {
  const {starts, cols, rows} = getGridInfo(rawCoordinates);
  const coordinates = rawCoordinates.map(({x, y}) => ({
    x: x - starts.x,
    y: y - starts.y,
  }));

  let result = 0;
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const totalDistance = coordinates.reduce(
        (acc, c) => acc + getDistance(c, {x, y}),
        0
      );
      if (totalDistance < 10000) result++;
    }
  }

  return result;
};

module.exports = [solution1, solution2].map(solution =>
  pipe(
    map(getCoordinates),
    solution
  )
);
