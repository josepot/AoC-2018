const idxFibonacci = new Map([
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 5],
  [4, 8],
  [5, 13],
  [6, 21],
  [7, 34],
  [8, 55],
  [9, 89],
  [10, 144],
  [11, 233],
]);

const fibonacciIdx = new Map([
  [1, 0],
  [2, 1],
  [3, 2],
  [5, 3],
  [8, 4],
  [13, 5],
  [21, 6],
  [34, 7],
  [55, 8],
  [89, 9],
  [144, 10],
  [233, 11],
]);

const getFibonacci = n => {
  if (idxFibonacci.has(n)) return idxFibonacci.get(n);
  const res = getFibonacci(n - 1) + getFibonacci(n - 2);
  idxFibonacci.set(n, res);
  fibonacciIdx.set(res, n);
  return res;
};

const getIdx = fib => fibonacciIdx.get(fib);

function* permutationsIterator(nItems, groupSize, ...exclusionIdxs) {
  const exclusions = new Set(exclusionIdxs);

  let i = 0;
  while (exclusions.has(i)) i++;
  let last;
  let first = (last = {val: getFibonacci(i++)});
  for (; i < nItems; i++) {
    if (exclusions.has(i)) continue;
    last.next = {val: getFibonacci(i), prev: last};
    last = last.next;
  }

  let lastLevel = {current: first};
  for (let i = 1; i < groupSize; i++) {
    lastLevel = {
      prev: lastLevel,
      current: lastLevel.current.next,
    };
    lastLevel.prev.next = lastLevel;
  }

  lastLevel.end = last;

  let level = lastLevel;
  while (level.prev) {
    level.prev.end = level.end.prev;
    level = level.prev;
  }

  do {
    const resultData = new Array(groupSize);
    level = lastLevel;
    for (let g = groupSize - 1; g > -1; g--) {
      resultData[g] = level.current.val;
      level = level.prev;
    }

    level = lastLevel;
    while (level && level.current === level.end) {
      level = level.prev;
    }

    const key = resultData.reduce((a, b) => a + b, 0);
    const subEntries = {};
    resultData.forEach(id => (subEntries[getIdx(id)] = key - id));
    const result = {key, subEntries};

    if (!level) return yield result;
    yield result;

    level.current = level.current.next;
    while (level.next) {
      level.next.current = level.current.next;
      level = level.next;
    }
  } while (true);
}

const solution = (matrix, startIdx) => {
  let distances = {};
  for (let i = 0; i < matrix.length; i++) {
    if (i === startIdx) continue;
    distances[i] = {};
    for (let z = 0; z < matrix.length; z++) {
      if (z === i || z === startIdx) continue;
      distances[i][getFibonacci(z)] = {
        distance: matrix[i][z] + matrix[z][startIdx],
        path: {val: i, next: {val: z}},
      };
    }
  }

  for (let groupSize = 2; groupSize < matrix.length - 1; groupSize++) {
    console.log(groupSize);
    const nextDistances = {};
    for (let main = 0; main < matrix.length; main++) {
      if (main === startIdx) continue;
      nextDistances[main] = {};
      const g = permutationsIterator(matrix.length, groupSize, startIdx, main);

      let next = g.next();
      while (!next.done) {
        const permutationData = next.value;
        nextDistances[main][permutationData.key] = Object.entries(
          permutationData.subEntries
        ).reduce(
          (acc, [subMain, subsetKey]) => {
            const distance =
              matrix[main][subMain] + distances[subMain][subsetKey].distance;
            return distance < acc.distance
              ? {
                  distance,
                  path: {val: main, next: distances[subMain][subsetKey].path},
                }
              : acc;
          },
          {distance: Infinity, path: null}
        );
        next = g.next();
      }
    }
    distances = nextDistances;
  }

  let winner = {distance: Infinity};
  for (let i = 0; i < matrix.length; i++) {
    if (i === startIdx) continue;
    const [current] = Object.values(distances[i]);
    const distance = matrix[i][startIdx] + current.distance;
    if (distance < winner.distance) {
      winner = {
        distance,
        path: current.path,
      };
    }
  }

  return winner;
};

/*
const matrix = new Array(5);
for (let i = 0; i < 5; i++) matrix[i] = new Array(5);
matrix[0][0] = 0;
matrix[0][1] = 6;
matrix[0][2] = 1;
matrix[0][3] = 3;
matrix[0][4] = 6;

matrix[1][0] = 6;
matrix[1][1] = 0;
matrix[1][2] = 4;
matrix[1][3] = 3;
matrix[1][4] = 2;

matrix[2][0] = 1;
matrix[2][1] = 4;
matrix[2][2] = 0;
matrix[2][3] = 2;
matrix[2][4] = 9;

matrix[3][0] = 3;
matrix[3][1] = 3;
matrix[3][2] = 2;
matrix[3][3] = 0;
matrix[3][4] = 5;

matrix[4][0] = 6;
matrix[4][1] = 2;
matrix[4][2] = 9;
matrix[4][3] = 5;
matrix[4][4] = 0;

console.log(solution(matrix, 0));
*/

// [...permutationsIterator(6, 2, 0, 2)].forEach(x => console.log(x));
/*
const N = 21;
const matrix = new Array(N);
console.log('populating data');
for (let i = 0; i < N; i++) matrix[i] = new Array(N);
for (let i = 0; i < N; i++) matrix[i][i] = 0;

for (let x = 0; x < N - 1; x++) {
  for (let y = x + 1; y < N; y++) {
    matrix[x][y] = Math.floor(Math.random() * 1000);
    matrix[y][x] = matrix[x][y];
  }
}

console.log('solving problem');
const start = Date.now();
const res = solution(matrix, 0);
const end = Date.now();
console.log(res);
console.log(`solved in ${end - start}ms`);
*/

module.exports = solution;
