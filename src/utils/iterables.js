function* fromLinkedNode(node, direction = 'next') {
  let current = node;
  while (current) {
    yield current.value;
    current = current[direction];
  }
}

const whileReducer = (check, compute, initVal) => iterable => {
  let acc = initVal;
  let item = iterable.next();

  while (check(acc, item.value)) {
    acc = compute(acc, item.value);
    item = iterable.next();
  }

  return acc;
};

module.exports = {whileReducer, fromLinkedNode};
