const solution1 = lines => {
  const data = lines.map(line => {
    const [, x, y, z, r] = line.match(/pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/);
    return [x, y, z, r].map(x => parseInt(x));
  });

  const maxR = data.reduce(
    (acc, [, , , r], idx) => (r > acc[0] ? [r, idx] : acc),
    [0, -1]
  );

  const winner = data[maxR[1]];

  return data.reduce(
    (acc, [x, y, z]) =>
      Math.abs(x - winner[0]) +
        Math.abs(y - winner[1]) +
        Math.abs(z - winner[2]) <=
      winner[3]
        ? acc + 1
        : acc,
    0
  );
};

const getDistance = (a, b) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);

const getWinners = (data, from, len) => {
  let winners = [0, []];
  for (let x = from[0]; x < from[0] + len; x++) {
    for (let y = from[1]; y < from[1] + len; y++) {
      for (let z = from[2]; z < from[2] + len; z++) {
        const nReachable = data.reduce(
          (acc, item) =>
            getDistance(item, [x, y, z]) <= item[3] ? acc + 1 : acc,
          0
        );
        if (nReachable > winners[0]) {
          winners = [nReachable, [[x, y, z]]];
        } else if (nReachable === winners[0]) winners[1].push([x, y, z]);
      }
    }
  }

  return winners;
};

const solution2 = lines => {
  const originalData = lines.map(line => {
    const [, x, y, z, r] = line.match(/pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/);
    return [x, y, z, r].map(x => parseInt(x));
  });

  let division = 10000000;

  let data = originalData.map(x => x.map(xx => Math.round(xx / division)));

  const xMinMax = data.reduce(
    (acc, [x]) => (x < acc[0] ? [x, acc[1]] : x > acc[1] ? [acc[0], x] : acc),
    [Infinity, -Infinity]
  );

  const yMinMax = data.reduce(
    (acc, [, x]) => (x < acc[0] ? [x, acc[1]] : x > acc[1] ? [acc[0], x] : acc),
    [Infinity, -Infinity]
  );

  const zMinMax = data.reduce(
    (acc, [, , x]) =>
      x < acc[0] ? [x, acc[1]] : x > acc[1] ? [acc[0], x] : acc,
    [Infinity, -Infinity]
  );

  const min = [xMinMax, yMinMax, zMinMax].reduce(
    (acc, [x]) => (x < acc ? x : acc),
    Infinity
  );

  const max = [xMinMax, yMinMax, zMinMax].reduce(
    (acc, [, x]) => (x > acc ? x : acc),
    -Infinity
  );

  let winners = getWinners(data, [min, min, min], max - min + 1);
  do {
    division /= 10;
    data = originalData.map(x => x.map(xx => Math.round(xx / division)));
    winners = winners[1]
      .map((winner, idx, arr) => {
        if (idx % 100 === 0) {
          console.log('progress', (idx / arr.length) * 100);
        }
        return getWinners(data, winner.map(x => x * 10 - 5), 10);
      })
      .reduce(
        (acc, w) => {
          if (w[0] > acc[0]) return w;
          if (w[0] === acc[0]) acc[1].push.apply(acc[1], w[1]);
          return acc;
        },
        [0, []]
      );
    console.log('division finished', division, winners[0], winners[1]);
  } while (division > 1);

  console.log('sorting winners');
  const finalWinner = winners[1].sort(
    (a, b) => getDistance(a, [0, 0, 0]) - getDistance(b, [0, 0, 0])
  )[0];
  console.log(finalWinner);
  return finalWinner.reduce((x, y) => x + y);
};

module.exports = [solution1, solution2];
