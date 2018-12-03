const tree = {};

const addWord = (word, root = tree) => {
  if (word.length === 0) return root;
  const [firstChar, ...rest] = word;
  root[firstChar] = addWord(rest, root[firstChar] || {});
  return root;
};

const findSimilar = (word, parent, tolerance, result = '') => {
  if (tolerance === -1) return [null];

  const [firstChar, ...rest] = word;

  if (rest.length === 0) {
    return tolerance > 0 || parent[firstChar] ? [result + firstChar] : [null];
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
    .reduce((acc, item) => acc.concat(item), [])
    .filter(x => x !== null);
};

const getCommonLetters = (a, b) =>
  a
    .split('')
    .filter((x, idx) => x === b[idx])
    .join('');

module.exports = lines => {
  for (let i = 0; i < lines.length; i++) {
    const word = lines[i];
    const [similar] = findSimilar(word, tree, 1);
    if (similar) return getCommonLetters(similar, word);
    addWord(word);
  }
};
