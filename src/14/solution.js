const {doubleCircularLinkedList} = require('../utils/linkedLists');

const solution1 = lines => {
  const input = parseInt(lines[0]);
  const initialNode = doubleCircularLinkedList([3, 7])[0];
  let lastNode = initialNode.prev;
  const elves = [initialNode, initialNode.next];
  let nAdded = 0;
  do {
    const values = elves.map(x => x.value);
    const nextNumbers = (values[0] + values[1])
      .toString(10)
      .split('')
      .map(x => parseInt(x));
    nAdded += nextNumbers.length;
    nextNumbers.forEach(x => {
      const node = {
        value: x,
        prev: lastNode,
        next: initialNode,
      };
      initialNode.prev = node;
      lastNode.next = node;
      lastNode = node;
    });

    values.forEach((val, idx) => {
      for (let i = 0; i < val + 1; i++) elves[idx] = elves[idx].next;
    });
  } while (nAdded < input + 10);

  let node = initialNode;
  for (let i = 0; i < input; i++) node = node.next;
  const result = [];
  for (let i = 0; i < 10; i++) {
    result.push(node.value);
    node = node.next;
  }
  return result.join('');
};

const solution2 = lines => {
  const targetStr = lines[0];
  const target = [...targetStr].map(x => parseInt(x));

  const initialNode = doubleCircularLinkedList([3, 7])[0];
  let lastNode = initialNode.prev;
  const elves = [initialNode, initialNode.next];
  let matched = [];
  let totalLen = 2;

  do {
    const values = elves.map(x => x.value);
    const nextNumbers = (values[0] + values[1])
      .toString(10)
      .split('')
      .map(x => parseInt(x));

    for (let nn = 0; nn < nextNumbers.length; nn++) {
      const value = nextNumbers[nn];
      totalLen++;

      if (value === target[matched.length]) {
        matched.push(value);
      } else if (matched.length > 0) {
        do {
          matched = matched.slice(1);
        } while (matched.length > 0 && !targetStr.startsWith(matched.join('')));
        if (value === target[matched.length]) matched.push(value);
      }

      if (matched.length === target.length) return totalLen - target.length;

      const node = {value, prev: lastNode, next: initialNode};

      initialNode.prev = node;
      lastNode.next = node;
      lastNode = node;
    }

    values.forEach((val, idx) => {
      for (let i = 0; i < val + 1; i++) elves[idx] = elves[idx].next;
    });
  } while (true);
};

module.exports = [solution1, solution2];
