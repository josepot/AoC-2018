const PQ = require('priorityqueuejs');
const modulo = 20183;
const xInc = 16807;
const yInc = 48271;

let depth;
let target;
let N_COLS;
let N_ROWS;
let grid = new Map();
let visited = new Map();

const getIdx = (x, y) => y * N_COLS + x;
const setPosition = (x, y, val) => grid.set(getIdx(x, y), val);
const setGrid = (x, y) => {
  const p1 = grid.get(getIdx(x - 1, y));
  const p2 = grid.get(getIdx(x, y - 1));
  grid.set(getIdx(x, y), (p1 * p2 + depth) % modulo);
};

const expand = () => {
  const squareSize = Math.ceil(Math.max(N_COLS, N_ROWS) * 1.5);
  const newGridData = new Array(squareSize * squareSize);
  const newVisitedData = [];

  const colDiff = squareSize - N_COLS;
  let newIdx = 0;
  for (let idx = 0; idx < grid.size; idx++) {
    if (visited.has(idx)) newVisitedData.push([newIdx, visited.get(idx)]);
    newGridData[newIdx++] = grid.get(idx);
    if ((idx + 1) % N_COLS === 0) {
      for (let i = 0; i < colDiff; i++) newGridData[newIdx++] = null;
    }
  }
  for (; newIdx < newGridData.length; newIdx++) newGridData[newIdx] = null;
  grid = new Map(newGridData.map((val, idx) => [idx, val]));
  visited = new Map(newVisitedData);
  const xInit = N_COLS;
  const yInit = N_ROWS;
  N_COLS = squareSize;
  N_ROWS = squareSize;

  let inc = xInc * xInit;
  for (let x = xInit; x < N_COLS; x++) {
    setPosition(x, 0, (inc + depth) % modulo);
    inc += xInc;
  }

  inc = yInc * yInit;
  for (let y = yInit; y < N_ROWS; y++) {
    setPosition(0, y, (inc + depth) % modulo);
    inc += yInc;
  }

  for (let y = 1; y < yInit; y++) {
    for (let x = xInit; x < N_COLS; x++) {
      setGrid(x, y);
    }
  }

  for (let y = yInit; y < N_ROWS; y++) {
    for (let x = 1; x < N_COLS; x++) {
      setGrid(x, y);
    }
  }
};

const getType = (x, y) => {
  if (x >= N_COLS || y >= N_ROWS) expand();
  return grid.get(getIdx(x, y)) % 3;
};

const solution1 = ([rawDepth, rawTarget]) => {
  depth = parseInt(rawDepth.split(': ')[1]);
  target = rawTarget
    .split(': ')[1]
    .split(',')
    .map(x => parseInt(x));
  N_COLS = target[0] + 1;
  N_ROWS = target[1] + 1;

  setPosition(0, 0, depth % modulo);

  let tmp = xInc;
  for (let x = 1; x < N_COLS; x++) {
    setPosition(x, 0, (tmp + depth) % modulo);
    tmp += xInc;
  }

  tmp = yInc;
  for (let y = 1; y < N_ROWS; y++) {
    setPosition(0, y, (tmp + depth) % modulo);
    tmp += yInc;
  }

  for (let x = 1; x < N_COLS; x++) {
    for (let y = 1; y < N_ROWS - 1; y++) {
      setGrid(x, y);
    }
  }

  for (let x = 1; x < N_COLS - 1; x++) {
    setGrid(x, N_ROWS - 1);
  }

  grid.set(getIdx(...target), grid.get(0));

  return [...grid.values()].map(x => x % 3).reduce((x, y) => x + y);
};

const getDistance = (x, y) => Math.abs(target[0] - x) + Math.abs(target[1] - y);

const TORCH = 'TORCH';
const CLIMBING = 'CLIMBING';
const NEITHER = 'NEITHER';

const typeAllows = [
  new Set([TORCH, CLIMBING]),
  new Set([CLIMBING, NEITHER]),
  new Set([TORCH, NEITHER]),
];

const getNextSquares = current =>
  [[0, -1], [-1, 0], [1, 0], [0, 1]]
    .map(([xDiff, yDiff]) => [current.x + xDiff, current.y + yDiff])
    .filter(([x, y]) => x > -1 && y > -1)
    .map(([x, y]) => {
      const type = getType(x, y);
      const [timeInc, equipment] =
        type === current.type || typeAllows[type].has(current.equipment)
          ? [1, current.equipment]
          : [
              8,
              [...typeAllows[type]].find(e => typeAllows[current.type].has(e)),
            ];

      return {
        x,
        y,
        nMoves: current.nMoves + 1,
        type,
        time: current.time + timeInc,
        distance: getDistance(x, y),
        equipment,
      };
    })
    .filter(({x, y, equipment, time}) => {
      const idx = getIdx(x, y);
      return (
        !visited.has(idx) ||
        !visited.get(idx).has(equipment) ||
        visited.get(idx).get(equipment) > time
      );
    });

const solution2 = lines => {
  solution1(lines);
  const options = new PQ((b, a) => {
    if (a.time !== b.time) return a.time - b.time;
    return a.distance - b.distance;
  });

  options.enq({
    x: 0,
    y: 0,
    nMoves: 0,
    type: 0,
    time: 0,
    distance: target[0] + target[1],
    equipment: TORCH,
  });
  visited.set(0, new Map([[TORCH, 0]]));

  do {
    const current = options.deq();
    if (current.distance === 0) {
      current.equipment = TORCH;
      current.time += 7;
      options.enq(current);
      continue;
    }
    getNextSquares(current).forEach(discovery => {
      options.enq(discovery);
      const idx = getIdx(discovery.x, discovery.y);
      if (!visited.has(idx)) visited.set(idx, new Map());
      visited.get(idx).set(discovery.equipment, discovery.time);
    });
  } while (options.peek().distance > 0 || options.peek().equipment !== TORCH);
  return options.peek().time;
};

module.exports = [solution1, solution2];
