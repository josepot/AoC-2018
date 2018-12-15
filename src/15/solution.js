const R = require('ramda');
const PQ = require('priorityqueuejs');

let N_COLS;
let N_ROWS;
const walls = new Set();

const getIdx = (x, y) => y * N_COLS + x;
const getPositionFromId = id => {
  const y = Math.floor(id / N_COLS);
  const x = id % N_COLS;
  return {x, y};
};

const getAvailableSquares = ({x, y}, myKind) =>
  [[0, -1], [-1, 0], [1, 0], [0, 1]]
    .map(([xDiff, yDiff]) => getIdx(x + xDiff, y + yDiff))
    .filter(x => !walls.has(x) && !myKind.has(x));

const getEnemyInfo = (myIdx, myKind, enemies) => {
  const queue = new PQ((b, a) => {
    if (a.steps !== b.steps) return a.steps - b.steps;
    return a.id - b.id;
  });
  const visited = new Set();
  queue.enq({
    steps: 0,
    id: myIdx,
    prev: null,
  });
  visited.add(myIdx);

  let enemyId;
  let current;
  do {
    current = queue.deq();
    const newOnes = getAvailableSquares(getPositionFromId(current.id), myKind);
    enemyId = newOnes
      .filter(n => enemies.has(n))
      .sort((a, b) => enemies.get(a).points - enemies.get(b).points)[0];
    if (enemyId != null) break;
    newOnes
      .filter(x => !visited.has(x))
      .forEach(n => {
        visited.add(n);
        queue.enq({
          steps: current.steps + 1,
          id: n,
          prev: current,
        });
      });
  } while (enemyId == null && queue.size() > 0);

  if (enemyId == null) return null;
  if (current.id === myIdx) return {enemyId, shouldAttack: true};

  const shouldAttack = current.steps === 1;
  while (current.steps > 1) current = current.prev;
  return {moveTo: current.id, shouldAttack, enemyId};
};

const processInput = lines => {
  const elves = new Map();
  const goblins = new Map();
  N_ROWS = lines.length;
  N_COLS = lines[0].length;
  R.range(0, N_COLS).forEach(x => walls.add(getIdx(x, -1)));
  lines.forEach((line, y) =>
    line.split('').forEach((val, x) => {
      const id = getIdx(x, y);
      if (val === '#') return walls.add(id);
      if (val === '.') return;
      const collection = val === 'G' ? goblins : elves;
      collection.set(id, {id, x, y, points: 200});
    })
  );
  return {elves, goblins};
};

const attack = (targetId, enemies, power) => {
  const target = enemies.get(targetId);
  target.points -= power;
  if (target.points > 0) return false;
  enemies.delete(targetId);
  return true;
};

const round = (elves, goblins, elvesPower = 3, stopOnElfDead = false) => {
  const allKeys = [
    ...[...goblins.keys()].map(id => ({
      id,
      myKind: goblins,
      enemies: elves,
      power: 3,
    })),
    ...[...elves.keys()].map(id => ({
      id,
      myKind: elves,
      enemies: goblins,
      power: elvesPower,
    })),
  ].sort((a, b) => a.id - b.id);

  let newPositionChanged = false;

  for (let i = 0; i < allKeys.length; i++) {
    if (goblins.size === 0 || elves.size === 0)
      return [newPositionChanged, false];
    const {id, myKind, enemies, power} = allKeys[i];
    if (!myKind.has(id)) continue;

    const enemyInfo = getEnemyInfo(id, myKind, enemies);

    if (!enemyInfo) continue;
    const {moveTo, enemyId, shouldAttack} = enemyInfo;
    if (moveTo) {
      newPositionChanged = true;
      const me = myKind.get(id);
      myKind.delete(id);
      me.id = moveTo;
      Object.assign(me, getPositionFromId(moveTo));
      myKind.set(moveTo, me);
    }
    if (shouldAttack) {
      const success = attack(enemyId, enemies, power);
      if (stopOnElfDead && success && enemies === elves) return [true, false];
      newPositionChanged = success || newPositionChanged;
    }
  }

  return [newPositionChanged, true];
};

const print = (elves, goblins) => {
  R.range(0, N_ROWS)
    .map(y =>
      R.range(0, N_COLS)
        .map(x => {
          const id = getIdx(x, y);
          if (walls.has(id)) return '#';
          if (elves.has(id)) return 'E';
          if (goblins.has(id)) return 'G';
          return '.';
        })
        .map((c, x) => {
          if (c === '.' || c === '#') return [c, null];
          const collection = c === 'E' ? elves : goblins;
          return [c, `${c}(${collection.get(getIdx(x, y)).points})`];
        })
        .reduce(
          (acc, [c, d]) => {
            acc[0].push(c);
            if (d) acc[1].push(d);
            return acc;
          },
          [[], []]
        )
        .map((x, idx) => x.join(idx === 0 ? '' : ', '))
        .join('    ')
    )
    .forEach(line => console.log(line));
  console.log('');
};

const solution1 = lines => {
  const {elves, goblins} = processInput(lines);
  let rounds = 0;
  let playing = false;
  do {
    rounds++;
    [, playing] = round(elves, goblins);
  } while (playing);
  const totalPoints = [...elves.values(), ...goblins.values()].reduce(
    (acc, f) => acc + f.points,
    0
  );
  return --rounds * totalPoints;
};

const solution2 = lines => {
  let elvesPower = 3;
  let rounds, elves, goblins;
  do {
    rounds = 0;
    let playing = false;
    const inputData = processInput(lines);
    elves = inputData.elves;
    goblins = inputData.goblins;
    elvesPower++;
    do {
      rounds++;
      [, playing] = round(elves, goblins, elvesPower, true);
    } while (playing);
  } while (goblins.size > 0);
  const totalPoints = [...elves.values(), ...goblins.values()].reduce(
    (acc, f) => acc + f.points,
    0
  );
  return --rounds * totalPoints;
};

module.exports = [solution1, solution2];
