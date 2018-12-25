const getDistance = (a, b = [0, 0, 0, 0]) =>
  Math.abs(a[0] - b[0]) +
  Math.abs(a[1] - b[1]) +
  Math.abs(a[2] - b[2]) +
  Math.abs(a[3] - b[3]);

const solution1 = lines => {
  const points = lines.map(line => line.split(',').map(x => parseInt(x, 10)));
  const nonConstelated = new Set(points.map((p, idx) => idx));

  const createConstelation = mainIdx => {
    if (!nonConstelated.has(mainIdx)) return;

    nonConstelated.delete(mainIdx);
    [...nonConstelated]
      .filter(
        candidateIdx => getDistance(points[mainIdx], points[candidateIdx]) < 4
      )
      .forEach(createConstelation);
  };

  let nConstelations = 0;
  while (nonConstelated.size > 0) {
    createConstelation(nonConstelated.values().next().value);
    nConstelations++;
  }

  return nConstelations;
};

module.exports = [solution1];
