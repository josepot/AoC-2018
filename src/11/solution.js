const input = 1723;
const SIZE = 300;

const getPowerLevel = (x, y) => {
  const rackId = x + 10;
  const starts = (rackId * y + input) * rackId;
  return (Math.trunc(starts / 100) % 10) - 5;
};

const solution2 = () => {
  const grid = new Array(SIZE + 1);
  for (let i = 0; i < SIZE + 1; i++) grid[i] = new Array(SIZE + 1);

  for (let i = 0; i < SIZE + 1; i++) {
    grid[0][i] = 0;
    grid[i][0] = 0;
  }

  for (let x = 1; x < SIZE + 1; x++) {
    for (let y = 1; y < SIZE + 1; y++) {
      grid[y][x] =
        getPowerLevel(x, y) +
        grid[y - 1][x] +
        grid[y][x - 1] -
        grid[y - 1][x - 1];
    }
  }

  const winner = {val: -Infinity};
  for (let size = 1; size < SIZE + 1; size++) {
    for (let y = size; y < SIZE + 1; y++) {
      for (let x = size; x < SIZE + 1; x++) {
        const val =
          grid[y][x] -
          grid[y - size][x] -
          grid[y][x - size] +
          grid[y - size][x - size];

        if (val > winner.val) {
          winner.val = val;
          winner.s = size;
          winner.y = y + 1;
          winner.x = x + 1;
        }
      }
    }
  }

  return [winner.x - winner.s, winner.y - winner.s, winner.s].join(',');
};

const solution1 = () => {
  const grid = new Array(SIZE);
  for (let i = 0; i < SIZE; i++) grid[i] = new Array(SIZE);

  for (let x = 1; x < SIZE + 1; x++) {
    for (let y = 1; y < SIZE + 1; y++) {
      grid[y - 1][x - 1] = getPowerLevel(x, y);
    }
  }

  let winner = {val: 0};

  for (let x = 0; x < SIZE - 3; x++) {
    for (let y = 0; y < SIZE - 3; y++) {
      let result = 0;
      for (let xx = 0; xx < 3; xx++) {
        for (let yy = 0; yy < 3; yy++) {
          result += grid[y + yy][x + xx];
        }
        if (result > winner.val) {
          winner.val = result;
          winner.pos = {x: x + 1, y: y + 1};
        }
      }
    }
  }
  return winner;
};

module.exports = [solution1, solution2];
