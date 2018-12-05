const {range} = require('ramda');

const linkedList = isCircular => values => {
  const instances = values.map(value => ({value}));
  range(0, values.length - 1).forEach(
    idx => (instances[idx].next = instances[idx + 1])
  );
  instances[instances.length - 1].next = isCircular ? instances[0] : null;
  return instances;
};

const doubleLinkedList = isCircular => values => {
  const instances = linkedList(isCircular)(values);
  let [node] = instances;
  node.prev = null;
  while (node && node.next && !node.next.prev) {
    node.next.prev = node;
    node = node.next;
  }
  return instances;
};

const countNodes = initialNode => {
  if (!initialNode) return 0;

  let curr = initialNode;
  let count = 0;

  while (curr) {
    count++;
    curr = curr.next;
  }
  return count;
};

module.exports = {
  linkedList: linkedList(false),
  circularLinkedList: linkedList(true),
  doubleLinkedList: doubleLinkedList(false),
  doubleCircularLinkedList: doubleLinkedList(false),
  countNodes,
};
