const {pipe} = require('ramda');

const compare = (a, b) => {
  let res = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      res++;
    }
  }
  return res;
};

const getWinners = lines => {
  for (let i = 0; i < Infinity; i++) {
    for (let ii = i + 1; ii < lines.length; ii++) {
      if (compare(lines[i], lines[ii]) === 1) {
        return [lines[i], lines[ii]];
      }
    }
  }
};

module.exports = pipe(
  getWinners,
  ([a, b]) =>
    a
      .split('')
      .filter((x, idx) => x === b[idx])
      .join('')
);
