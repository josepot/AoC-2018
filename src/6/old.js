const {linkedList, countNodes} = require('../utils/linkedLists');
const {max, map, sort, compose: c, pipe, head, range, min} = require('ramda');

const getCoordinates = pipe(
  c(map(parseInt), split(', ')),
  ([x, y]) => ({x, y})
);

const getGridInfo = lines => {
  const right = lines.reduce((acc, {x}) => (x > acc ? x : acc), 0);
  const bottom = lines.reduce((acc, {y}) => (y > acc ? y : acc), 0);
  const left = lines.reduce((acc, {x}) => (x < acc ? x : acc), Infinity);
  const top = lines.reduce((acc, {y}) => (y < acc ? y : acc), Infinity);
  return {
    starts: {x: left, y: top},
    width: right - left,
    height: bottom - top,
  };
};

const wrongProblem = pipe(
  coordinates => {
    const xSort = sort((a, b) => a.x - b.x, coordinates);
    const ySort = sort((a, b) => a.y - b.y, coordinates);

    let node = linkedList(xSort)[0];
    while (node) {
      let candidate = node.next;
      while (candidate) {
        if (candidate.value.x !== node.value.x) {
          node.value.right = candidate.value;
          candidate.value.left = node.value;
          candidate = null;
        } else {
          candidate = candidate.next;
        }
      }
      node = node.next;
    }

    node = linkedList(ySort)[0];
    while (node) {
      let candidate = node.next;
      while (candidate) {
        if (candidate.value.y !== node.value.y) {
          node.value.bottom = candidate.value;
          candidate.value.top = node.value;
          candidate = null;
        } else {
          candidate = candidate.next;
        }
      }
      node = node.next;
    }

    return coordinates;
  },
  coordinates => coordinates.map(getArea)
);

const getArea = i => {
  if (!i.left && !i.top) return 0;
  if (!i.left && !i.bottom) return 0;
  if (!i.right && !i.top) return 0;
  if (!i.right && !i.bottom) return 0;

  const right = i.right ? i.right.x : i.x;
  const left = i.left ? i.left.x : i.x;

  const top = i.top ? i.top.y : i.y;
  const bottom = i.bottom ? i.bottom.y : i.y;
  return (right - left) * (bottom - top);
};

const solution1 = pipe(
  map(getCoordinates),
  getGridInfo,
  // map(([x, y]) => ({x, y})),
);

const solution2 = pipe(head);

module.exports = [solution1, solution2];

