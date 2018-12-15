const R = require('ramda');
const PQ = require('priorityqueuejs');

let N_COLS;
let N_ROWS;
let fighters = new Map();
const alive = {G: 0, E: 0};
let targets = new Map();
const walls = new Set();

const getIdx = (x, y) => y * N_COLS + x;
const getPositionFromId = id => {
  const y = Math.floor(id / N_COLS);
  const x = id % N_COLS;
  return {x, y};
};
// const getPosition = ({x, y}, from = grid) => from[getIdx(x, y)];
// const setPosition = (x, y, val, to = grid) => (to[getIdx(x, y)] = val);

const processInput = lines => {
  N_ROWS = lines.length;
  N_COLS = lines[0].length;
  R.range(0, N_COLS).forEach(x => walls.add(getIdx(x, -1)));
  lines.forEach((line, y) =>
    line.split('').forEach((val, x) => {
      const id = getIdx(x, y);
      if (val === '#') return walls.add(id);
      if (val === 'G' || val === 'E') {
        alive[val]++;
        fighters.set(id, {
          id,
          x,
          y,
          type: val,
          points: 200,
        });
      }
    })
  );
};

const subtract = (a, b) => a - b;
const getTarget = fighter =>
  [[0, -1], [-1, 0], [1, 0], [0, 1]]
    .map(([xDiff, yDiff]) =>
      fighters.get(getIdx(fighter.x + xDiff, fighter.y + yDiff))
    )
    .filter(x => x && x.type !== fighter.type)[0];

const attack = target => {
  target.points -= 3;
  if (target.points > 0) return false;
  alive[target.type]--;
  fighters.delete(target.id);
  if (target.type === 'E') targets = new Map();
  return true;
};

const tryAttack = fighter => {
  const target = getTarget(fighter);
  if (!target) return false;
  return attack(target);
};

const getAvailableSquares = ({x, y}, fightersAllowed = true) =>
  [[0, -1], [-1, 0], [1, 0], [0, 1]]
    .map(([xDiff, yDiff]) => getIdx(x + xDiff, y + yDiff))
    .filter(x => !walls.has(x) && (fightersAllowed || !fighters.has(x)));

const getElfTarget = goblin => {
  if (targets.has(goblin.id)) return targets.get(goblin.id);
  const visited = new Set();
  let queue = new PQ((b, a) => {
    if (a.steps !== b.steps) return a.steps - b.steps;
    return a.id - b.id;
  });

  visited.add(goblin.id);
  getAvailableSquares(goblin).forEach(id => {
    queue.enq({
      steps: 1,
      isTarget: fighters.has(id) && fighters.get(id).type === 'E',
      id,
      prev: null,
    });
  });

  if (queue.size() === 0) return null;
  do {
    const current = queue.deq();
    visited.add(current.id);
    getAvailableSquares(getPositionFromId(current.id))
      .filter(x => !visited.has(x))
      .forEach(id => {
        queue.enq({
          steps: current.steps + 1,
          isTarget: fighters.has(id) && fighters.get(id).type === 'E',
          id,
        });
      });
  } while (!queue.peek().isTarget);

  const target = queue.peek().id;
  targets.set(goblin.id, target);
  return target;
};

const findNextStep = goblin => {
  const target = getElfTarget(goblin);
  const targetPosition = getPositionFromId(target);

  const visited = new Map();
  const queue = new PQ((b, a) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    return a.id - b.id;
  });

  const getDistance = id => {
    const pos = getPositionFromId(id);
    return (
      Math.abs(pos.x - targetPosition.x) + Math.abs(pos.y - targetPosition.y)
    );
  };

  visited.set(goblin.id, 0);
  queue.enq({
    id: goblin.id,
    steps: 0,
    distance: getDistance(goblin.id),
    prev: null,
  });

  let winner = queue.peek();
  do {
    const current = queue.deq();
    if (
      current.distance < winner.distance ||
      (current.distance === winner.distance && current.id < winner.id)
    ) {
      winner = current;
    }
    getAvailableSquares(getPositionFromId(current.id), false)
      .filter(x => !visited.has(x) || visited.get(x) > current.steps + 1)
      .forEach(id => {
        const distance = getDistance(id);
        const steps = current.steps + 1;
        visited.set(id, steps);
        queue.enq({
          id,
          steps,
          distance,
          prev: current,
        });
      });
  } while (queue.size() > 0);

  if (winner.prev === null) return null;
  while (winner.prev.steps > 0) winner = winner.prev;
  return winner.id;
};

const goblinMove = (goblin, positionChanged) => {
  const target = getTarget(goblin);
  if (target) return attack(target);

  if (!positionChanged) return false;
  const nextStep = findNextStep(goblin);
  if (!nextStep || fighters.has(nextStep)) return false;
  fighters.delete(goblin.id);
  goblin.id = nextStep;
  Object.assign(goblin, getPositionFromId(nextStep));
  fighters.set(nextStep, goblin);
  return true;
};

const round = positionChanged => {
  let nextPositionChanged = false;
  [...fighters.keys()].sort(subtract).forEach(id => {
    if (alive.G == 0 || alive.E === 0) return;
    const fighter = fighters.get(id);
    if (!fighter) return;
    if (
      (fighter.type === 'G' ? goblinMove : tryAttack)(fighter, positionChanged)
    )
      nextPositionChanged = true;
  });
  return nextPositionChanged;
};

const print = () => {
  R.range(0, N_ROWS)
    .map(y =>
      R.range(0, N_COLS)
        .map(x => {
          const id = getIdx(x, y);
          if (walls.has(id)) return '#';
          if (fighters.has(id)) return fighters.get(id).type;
          return '.';
        })
        .join('')
    )
    .forEach(line => console.log(line));
  console.log(alive);
};

const solution1 = lines => {
  processInput(lines);

  let rounds = 0;
  let positionChanged = true;
  do {
    if (positionChanged) print();
    positionChanged = round(positionChanged);
    rounds++;
  } while (alive.G > 0 && alive.E > 0);
  const totalPoints = [...fighters.values()].reduce(
    (acc, f) => acc + f.points,
    0
  );
  return rounds * totalPoints;
};

const solution2 = lines => {
  return lines;
};

module.exports = [solution1, solution2];
