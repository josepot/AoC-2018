const permutationsIterator = (nItems, groupSize, ...exclusionIdxs) => {
  const exclusions = new Set(exclusionIdxs);

  let i = 0;
  while (exclusions.has(i)) i++;
  let prev;
  let first = (prev = {val: i++});
  for (; i < nItems; i++) {
    if (exclusions.has(i)) continue;
    prev.next = {val: i};
    prev = prev.next;
  }

  let lastLevel = {start: first, current: first};
  for (let i = 1; i < groupSize; i++) {
    lastLevel = {
      prev: lastLevel,
      start: lastLevel.start.next,
      current: lastLevel.start.next,
    };
  }

  const result = [];

  do {
    const innerRes = new Array(groupSize);
    let level = lastLevel;
    for (let g = groupSize - 1; g > -1; g--) {
      innerRes[g] = level.current.val;
      level = level.prev;
    }
    result.push(innerRes);

    level = lastLevel;
    level.current = level.current.next;
    while (!level.current) {
      level.current = level.start = level.start.next;
      if (!level.current) return result;
      level = level.prev;
      level.current = level.current.next;
    }
  } while (true);
};

const solution = (matrix, startIdx) => {
  let distances = {};
  for (let i = 0; i < matrix.length; i++) {
    if (i === startIdx) continue;
    distances[i] = {};
    for (let z = 0; z < matrix.length; z++) {
      if (z === i || z === startIdx) continue;
      distances[i][z] = {
        distance: matrix[i][z] + matrix[z][startIdx],
        path: [i, z].join(','),
      };
    }
  }

  for (let groupSize = 2; groupSize < matrix.length - 1; groupSize++) {
    const nextDistances = {};
    for (let main = 0; main < matrix.length; main++) {
      if (main === startIdx) continue;
      nextDistances[main] = {};
      permutationsIterator(matrix.length, groupSize, startIdx, main).forEach(
        permutation => {
          let best = {distance: Infinity, path: ''};
          for (let i = 0; i < groupSize; i++) {
            const subMain = permutation[i];
            const subsetKey = permutation.filter(x => x !== subMain).join(',');
            const distance =
              matrix[main][subMain] + distances[subMain][subsetKey].distance;
            if (distance < best.distance)
              best = {
                distance,
                path: main + ',' + distances[subMain][subsetKey].path,
              };
          }
          nextDistances[main][permutation.join(',')] = best;
        }
      );
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
*/

// console.log(solution(matrix, 0));
// permutationsIterator(6, 3, 0, 3).forEach(x => console.log(x));

module.exports = solution;
