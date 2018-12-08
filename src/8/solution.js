const {add, compose: c, head, map, pipe, split} = require('ramda');

const getSubtree = (source, from = 0) => {
  const nChilds = source[from];
  const nMetadata = source[from + 1];
  const dataStart = from + 2;
  const children = [];

  if (nChilds === 0) {
    return {
      nChilds,
      nMetadata,
      from,
      nextStart: dataStart + nMetadata,
      metadata: source.slice(dataStart, dataStart + nMetadata),
      children: [],
    };
  }

  let last = {nextStart: dataStart};
  for (let i = 0; i < nChilds; i++) {
    last = getSubtree(source, last.nextStart);
    children.push(last);
  }

  return {
    nChilds,
    nMetadata,
    from,
    nextStart: last.nextStart + nMetadata,
    metadata: source.slice(last.nextStart, last.nextStart + nMetadata),
    children,
  };
};

const getMetadataSum = node =>
  node.metadata.reduce(add) +
  node.children.reduce((acc, child) => acc + getMetadataSum(child), 0);

const getNodeValue = node =>
  node.children.length === 0
    ? node.metadata.reduce(add)
    : node.metadata.reduce((acc, idx) => {
        const child = node.children[idx - 1];
        return !child ? acc : acc + getNodeValue(child);
      }, 0);

const getInput = pipe(
  head,
  split(' '),
  map(parseInt)
);
const getTree = c(getSubtree, getInput);

const solution1 = c(getMetadataSum, getTree);
const solution2 = c(getNodeValue, getTree);

module.exports = [solution1, solution2];
