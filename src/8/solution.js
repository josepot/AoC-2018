const getSubtree = (source, from) => {
  const nChilds = source[from];
  const nMetadata = source[from + 1];
  const children = [];
  if (nChilds === 0) {
    return {
      nChilds,
      nMetadata,
      from,
      end: from + nMetadata + 1,
      metadata: source.slice(from + 2, from + 2 + nMetadata),
      children: [],
    };
  }

  let next = from + 2;
  let lastChild;
  for (let i = 0; i < nChilds; i++) {
    lastChild = getSubtree(source, next);
    next = lastChild.end + 1;
    children.push(lastChild);
  }

  return {
    nChilds,
    nMetadata,
    from,
    end: lastChild.end + nMetadata,
    metadata: source.slice(lastChild.end + 1, lastChild.end + nMetadata + 1),
    children,
  };
};

const metadataSum = node =>
  node.metadata.reduce((x, y) => x + y, 0) +
  node.children.reduce((acc, child) => acc + metadataSum(child), 0);

const solution1 = lines => {
  const numbers = lines[0].split(' ').map(x => parseInt(x, 10));
  const tree = getSubtree(numbers, 0);
  return metadataSum(tree);
};

const getNodeValue = node =>
  node.children.length === 0
    ? node.metadata.reduce((x, y) => x + y, 0)
    : node.metadata.reduce((acc, idx) => {
        const child = node.children[idx - 1];
        return !child ? acc : acc + getNodeValue(child);
      }, 0);

const solution2 = lines => {
  const numbers = lines[0].split(' ').map(x => parseInt(x, 10));
  const tree = getSubtree(numbers, 0);
  return getNodeValue(tree);
};

module.exports = [solution1, solution2];
