const {Set} = require('immutable');
const {head, map, pipe, prop} = require('ramda');
const {circularLinkedList} = require('../utils/linkedLists');
const Iterables = require('../utils/iterables');

module.exports = pipe(
  map(parseInt),
  circularLinkedList,
  head,
  Iterables.fromLinkedNode,
  Iterables.whileReducer(
    ({visited, frequency}) => !visited.has(frequency),
    ({visited, frequency}, change) => ({
      visited: visited.add(frequency),
      frequency: frequency + change,
    }),
    {visited: Set(), frequency: 0}
  ),
  prop('frequency')
);
