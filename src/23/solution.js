const R = require('ramda');

const getDistance = (a, b = [0, 0, 0]) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);

const solution1 = lines => {
  const bots = lines.map(line => {
    const [, x, y, z, r] = line.match(/pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/);
    return [x, y, z, r].map(x => parseInt(x));
  });

  const maxR = bots.reduce(
    (acc, [, , , r], idx) => (r > acc[0] ? [r, idx] : acc),
    [0, -1]
  );

  const winner = bots[maxR[1]];

  return bots.reduce(
    (acc, bot) => (getDistance(winner, bot) <= winner[3] ? acc + 1 : acc),
    0
  );
};

const solution2 = lines => {
  const bots = lines.map(line => {
    const [, x, y, z, r] = line.match(/pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/);
    return [x, y, z, r].map(x => parseInt(x));
  });

  const minsMaxes = [0, 1, 2].map(pos =>
    bots
      .map(bot => bot[pos])
      .reduce(
        (acc, x) => (x < acc[0] ? [x, acc[1]] : x > acc[1] ? [acc[0], x] : acc),
        [Infinity, -Infinity]
      )
  );
  const diffs = minsMaxes.map(([min, max]) => max - min);
  const maxDiff = diffs.reduce((a, b) => Math.max(a, b));

  let gapSize = Math.pow(2, Math.floor(Math.log2(maxDiff)));
  const nScans = Math.log2(gapSize) + 1;

  let center = minsMaxes.map(([min], idx) => min + Math.floor(diffs[idx] / 2));
  let winner = [[Infinity, Infinity, Infinity], Infinity];
  for (let scanN = 0; scanN < nScans; scanN++) {
    let max = 0;

    const initDiff = gapSize * 2;
    const gaps = R.range(0, 5).map(x => x * gapSize);

    gaps
      .map(g => center[0] - initDiff + g)
      .forEach(x => {
        gaps
          .map(g => center[1] - initDiff + g)
          .forEach(y => {
            gaps
              .map(g => center[2] - initDiff + g)
              .forEach(z => {
                const current = [x, y, z];
                const nAtReach = bots.reduce(
                  (acc, bot) =>
                    getDistance(bot, current) - bot[3] <= 0 ? acc + 1 : acc,
                  0
                );

                if (
                  nAtReach > max ||
                  (nAtReach === max && getDistance(current) < winner[1])
                ) {
                  max = nAtReach;
                  winner = [current, getDistance(current)];
                }
              });
          });
      });

    [center] = winner;
    gapSize /= 2;
  }
  return winner[1];
};

module.exports = [solution1, solution2];
