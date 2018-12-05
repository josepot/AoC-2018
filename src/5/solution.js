const {doubleLinkedList, countNodes} = require('../utils/linkedLists');
const {pipe, head, range, min} = require('ramda');

const UPPER_CASE_A = 65;
const LOWER_CASE_A = 97;
const CASE_DIFF = LOWER_CASE_A - UPPER_CASE_A;

const areEquivalent = (a, b) => Math.abs(a - b) === CASE_DIFF;

const removeDuplicates = firstNode => {
  let initialNode = firstNode;
  let current = initialNode;

  while (current && current.next) {
    if (areEquivalent(current.value, current.next.value)) {
      if (current.prev) {
        current.prev.next = current.next.next;
        if (current.next.next) {
          current.next.next.prev = current.prev;
        }
        current = current.prev;
      } else {
        initialNode = current.next.next;
        if (initialNode) {
          initialNode.prev = null;
        }
        current = initialNode;
      }
    } else {
      current = current.next;
    }
  }

  return initialNode;
};

const react = pipe(
  doubleLinkedList,
  head,
  removeDuplicates
);
const countAfterReact = pipe(
  react,
  countNodes
);

const solution1 = pipe(
  head,
  x => x.split('').map(x => x.charCodeAt(0)),
  countAfterReact
);

const solution2 = pipe(
  head,
  x => x.split('').map(x => x.charCodeAt(0)),
  arr =>
    range(UPPER_CASE_A, LOWER_CASE_A)
      .map(c => arr.filter(i => i !== c && i !== c + CASE_DIFF))
      .map(countAfterReact)
      .reduce(min)
);

module.exports = [solution1, solution2];
