const {pipe, min, head, length, range} = require('ramda');

const removeDuplicates = arr => {
  const indexes = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (Math.abs(arr[i] - arr[i + 1]) === 32) {
      indexes.push(i++);
    }
  }

  let nRemoved = 0;
  indexes.forEach(i => {
    arr.splice(i - nRemoved, 2);
    nRemoved += 2;
  });
  return arr;
};
const removeAll = arr => {
  let prevLen = arr.length;
  do {
    prevLen = arr.length;
    removeDuplicates(arr);
  } while (arr.length !== prevLen);
  return arr;
};

const getNChar = (arr, charCode) => {
  const res = removeAll(
    arr.filter(i => !(i === charCode || i === charCode + 32))
  );
  return res.length;
};

const solution1 = pipe(
  head,
  x => x.split('').map(x => x.charCodeAt(0)),
  removeAll,
  length
);

const solution2 = pipe(
  head,
  x => x.split('').map(x => x.charCodeAt(0)),
  arr => {
    return range(0, 32)
      .map(charCode => getNChar(arr, charCode + 65))
      .reduce(min);
  }
);

module.exports = [solution1, solution2];
