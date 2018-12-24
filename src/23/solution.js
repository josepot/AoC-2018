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

const get3DPermutations = arr =>
  R.unnest(R.unnest(arr.map(x => arr.map(y => arr.map(z => [x, y, z])))));

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

  let center = minsMaxes.map(([min], idx) => min + Math.floor(diffs[idx] / 2));
  let bestDistanceToCenter;

  for (
    let gapSize = Math.pow(2, Math.floor(Math.log2(maxDiff)));
    gapSize >= 1;
    gapSize /= 2
  ) {
    const gaps = R.range(0, 5).map(x => x * gapSize - gapSize * 2);

    [center, bestDistanceToCenter] = get3DPermutations(gaps)
      .map(([x, y, z]) => [x + center[0], y + center[1], z + center[2]])
      .map(position => [
        position,
        bots.reduce(
          (acc, bot) =>
            getDistance(bot, position) - bot[3] <= 0 ? acc + 1 : acc,
          0
        ),
      ])
      .reduce(
        ([nextCenter, distanceToCenter, maxAtReach], [position, nAtReach]) =>
          nAtReach > maxAtReach ||
          (nAtReach === maxAtReach && getDistance(position) < distanceToCenter)
            ? [position, getDistance(position), nAtReach]
            : [nextCenter, distanceToCenter, maxAtReach],
        [[Infinity, Infinity, Infinity], Infinity, 0]
      );
  }
  return bestDistanceToCenter;
};

module.exports = [solution1, solution2];
