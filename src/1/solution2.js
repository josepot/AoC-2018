const {head, map, pipe} = require('ramda');
const {circularLinkedList} = require('../utils/linkedLists');

const findRepeatedFrequency = initialNode => {
  let node = initialNode;
  let frequency = 0;
  const visited = new Set();

  while (!visited.has(frequency)) {
    visited.add(frequency);
    frequency += node.value;
    node = node.next;
  }

  return frequency;
};

module.exports = pipe(
  map(parseInt),
  circularLinkedList,
  head,
  findRepeatedFrequency
);
