const R = require('ramda');
const VERTICAL = 'VERTICAL';
const HORIZONTAL = 'HORIZONTAL';

let corners;
let spring;
let N_COLS;
let N_ROWS;
const walls = new Set();
const water = new Set();

const getIdx = ({x, y}) => y * N_COLS + x;
const getPositionFromIdx = id => {
  const y = Math.floor(id / N_COLS);
  const x = id % N_COLS;
  return {x, y};
};

const getLineInfo = line => {
  const [left, right] = line.split(', ');
  const [fromType, fromVal] = left.split('=');

  const [, toVal] = right.split('=');
  const [to1, to2] = toVal.split('..').map(x => parseInt(x));

  return {
    type: fromType === 'x' ? VERTICAL : HORIZONTAL,
    start: parseInt(fromVal),
    range: [to1, to2],
  };
};

const procesLines = lines => {
  const rawInfo = lines.map(getLineInfo);
  corners = rawInfo.reduce(
    (acc, current) => {
      const minY = current.type === VERTICAL ? current.range[0] : current.start;
      const maxY = current.type === VERTICAL ? current.range[1] : current.start;
      const minX =
        current.type === HORIZONTAL ? current.range[0] : current.start;
      const maxX =
        current.type === HORIZONTAL ? current.range[1] : current.start;

      acc.y.min = Math.min(minY, acc.y.min);
      acc.y.max = Math.max(maxY, acc.y.max);

      acc.x.min = Math.min(minX, acc.x.min);
      acc.x.max = Math.max(maxX, acc.x.max);
      return acc;
    },
    {
      x: {min: Infinity, max: -Infinity},
      y: {min: Infinity, max: -Infinity},
    }
  );

  N_COLS = corners.x.max - corners.x.min + 1;
  N_ROWS = corners.y.max - corners.y.min + 1;

  rawInfo
    .map(line => {
      if (line.type === VERTICAL) {
        line.start -= corners.x.min;
        line.range[0] -= corners.y.min;
        line.range[1] -= corners.y.min;
      } else {
        line.start -= corners.y.min;
        line.range[0] -= corners.x.min;
        line.range[1] -= corners.x.min;
      }
      return line;
    })
    .forEach(({type, start, range}) => {
      console.log(type, start, range);
      const len = range[1] - range[0];
      const [fixed, variant] = type === VERTICAL ? ['x', 'y'] : ['y', 'x'];
      for (let i = range[0]; i < len; i++) {
        const position = {[fixed]: start, [variant]: range[0] + i};
        console.log(position);
        walls.add(getIdx(position));
      }
    });
  spring = getIdx({x: 500 - corners.x.min, y: 0});
};

const findEnd = (position, direction) => {
  do {
    const nextPosition = Object.assign({}, position);
    const nextPositionIdx = getIdx(nextPosition);

    nextPosition.x += direction;
    if (walls.has(nextPositionIdx)) return [position, false];
    water.add(nextPositionIdx);
    if (!walls.has(getIdx({x: nextPosition.x, y: nextPosition.y + 1}))) {
      return [position, true];
    }
  } while (true);
};

const fillUpTank = position => {
  const result = [];
  do {
    const [endLeft, isLeftStream] = findEnd(position, -1);
    const [endRight, isRightStream] = findEnd(position, 1);

    if (isLeftStream) result.push(endLeft);
    if (isRightStream) result.push(endRight);
    position.y--;
  } while (result.length === 0);
  return result;
};

const propagateWater = () => {
  let streams = [spring];
  while (streams.length > 0) {
    const idx = streams.shift();
    let lastIdxPos = idx;
    let lastPosition = getPositionFromIdx(idx);
    do {
      lastPosition.y++;
      lastIdxPos = getIdx(lastPosition);
      if (walls.has(lastIdxPos)) {
        streams.push(...fillUpTank(Object.assign({}, lastPosition)));
        break;
      } else if (water.has(lastIdxPos)) {
        break;
      }
      water.add(lastIdxPos);
    } while (lastPosition.y < N_ROWS - 1);
  }
};

const print = () => {
  R.range(0, N_ROWS)
    .map(y =>
      R.range(0, N_COLS)
        .map(x => {
          const id = getIdx({x, y});
          if (walls.has(id)) return '#';
          if (water.has(id)) return '~';
          return '.';
        })
        .join('')
    )
    .forEach(line => console.log(line));
  console.log('');
};

const solution1 = lines => {
  procesLines(lines);
  console.log([...walls].sort((a, b) => a - b));
  print();
  propagateWater();
  return water.size;
};

module.exports = [solution1];
