const R = require('ramda');
const VERTICAL = 'VERTICAL';
const HORIZONTAL = 'HORIZONTAL';

let corners;
let spring;
let N_COLS;
let N_ROWS;
const walls = new Set();
const water = new Set();
const allStreams = new Set();

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
      const [fixed, variant] = type === VERTICAL ? ['x', 'y'] : ['y', 'x'];
      for (let i = range[0]; i < range[1] + 1; i++) {
        const position = {[fixed]: start, [variant]: i};
        walls.add(getIdx(position));
      }
    });
  spring = getIdx({x: 500 - corners.x.min, y: 0});
  water.add(spring);
};

const findEnd = (position, direction) => {
  let nextPosition = Object.assign({}, position);
  do {
    nextPosition.x += direction;
    const nextPositionIdx = getIdx(nextPosition);

    if (walls.has(nextPositionIdx)) return [nextPositionIdx, false];
    water.add(nextPositionIdx);
    const positionBelow = getIdx({x: nextPosition.x, y: nextPosition.y + 1});
    if (!walls.has(positionBelow) && !water.has(positionBelow)) {
      const previous = getIdx({
        x: nextPosition.x - direction,
        y: nextPosition.y,
      });
      if (allStreams.has(previous)) {
        water.delete(nextPositionIdx);
        return [previous, true];
      }
      return [nextPositionIdx, true];
    }
  } while (true);
};

const fillUpTank = position => {
  const result = [];
  do {
    water.add(getIdx(position));
    const [endLeft, isLeftStream] = findEnd(position, -1);
    const [endRight, isRightStream] = findEnd(position, 1);

    if (isLeftStream) result.push(endLeft);
    if (isRightStream) result.push(endRight);
    position.y--;
  } while (result.length === 0);
  return result;
};

// let count = 0;
const propagateWater = () => {
  allStreams.add(spring);
  let streams = new Set([spring]);
  while (streams.size > 0) {
    const idx = streams.values().next().value;
    streams.delete(idx);
    let lastIdxPos = idx;
    let lastPosition = getPositionFromIdx(idx);
    do {
      lastPosition.y++;
      lastIdxPos = getIdx(lastPosition);
      if (walls.has(lastIdxPos) || water.has(lastIdxPos)) {
        fillUpTank(
          Object.assign(
            {y: walls.has(lastIdxPos) ? lastPosition.y - 1 : lastPosition.y},
            lastPosition
          )
        )
          .filter(x => !allStreams.has(x))
          .forEach(x => {
            allStreams.add(x);
            streams.add(x);
          });
        /*
        if (++count === 30) {
          print();
          throw null;
        }
        */
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
  propagateWater();
  print();
  return [...water]
    .map(getPositionFromIdx)
    .filter(({x, y}) => x > -1 && y > -1 && x < N_COLS && y < N_ROWS).length;
};

module.exports = [solution1];
