const {
  compose: c,
  converge,
  head,
  isEmpty,
  pipe,
  prop,
  reduceWhile,
} = require('ramda');

const addWord = (word, root) => {
  if (word.length === 0) return root;
  const [firstChar, ...rest] = word;
  return Object.assign({}, root, {
    [firstChar]: addWord(rest, root[firstChar] || {}),
  });
};

const findSimilar = (word, parent, tolerance, result = '') => {
  if (tolerance === -1) return [];

  const [firstChar, ...rest] = word;

  if (rest.length === 0) {
    return tolerance > 0 || parent[firstChar] ? [result + firstChar] : [];
  }

  return Object.keys(parent)
    .map(c =>
      findSimilar(
        rest,
        parent[c],
        firstChar === c ? tolerance : tolerance - 1,
        result + c
      )
    )
    .reduce((acc, item) => acc.concat(item), []);
};

const getCommonLetters = (a, b) =>
  a
    .split('')
    .filter((x, idx) => x === b[idx])
    .join('');

module.exports = pipe(
  reduceWhile(
    c(isEmpty, prop('similars')),
    ({words}, next) => ({
      similars: findSimilar(next, words, 1),
      words: addWord(next, words),
      latest: next,
    }),
    {words: {}, similars: [], latest: ''}
  ),
  converge(getCommonLetters, [prop('latest'), c(head, prop('similars'))])
);
