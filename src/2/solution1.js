module.exports = lines =>
  lines
    .map(line =>
      line.split('').reduce((acc, char) => {
        acc[char] = (acc[char] || 0) + 1;
        return acc;
      }, {})
    )
    .map(lineRes =>
      Object.values(lineRes)
        .filter(val => val === 2 || val === 3)
        .reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {})
    )
    .reduce(
      (acc, val) => {
        acc[0] += val[2] === undefined ? 0 : 1;
        acc[1] += val[3] === undefined ? 0 : 1;
        return acc;
      },
      [0, 0]
    )
    .reduce((x, y) => x * y);
