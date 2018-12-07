const {
  max,
  split,
  map,
  compose: c,
  pipe,
  reduce,
  omit,
  values,
} = require('ramda');
const pQueue = require('priorityqueuejs');

const UPPER_CASE_A = 65;
const LOWER_CASE_A = 97;
const CASE_DIFF = LOWER_CASE_A - UPPER_CASE_A;

const parseLines = map(
  pipe(
    line =>
      line.match(/Step (\w) must be finished before step (\w) can begin./),
    ([, child, parent]) => {
      return {
        child: child.charCodeAt(0) - UPPER_CASE_A,
        parent: parent.charCodeAt(0) - UPPER_CASE_A,
      };
    }
  )
);

const childs = new Array(CASE_DIFF);
const parents = new Array(CASE_DIFF);

const printRes = x =>
  String.fromCharCode.apply(String, x.map(i => i + UPPER_CASE_A));

const solution1 = parsedLines => {
  const availableKeys = new Set();
  const result = [];

  parsedLines.forEach(({parent, child}) => {
    childs[child] = (childs[child] || []).concat(parent);
    parents[parent] = (parents[parent] || []).concat(child);
    availableKeys.add(parent);
    availableKeys.add(child);
  });

  while (availableKeys.size > 0) {
    const candidates = [...availableKeys].filter(
      x => !parents[x] || parents[x].length === 0
    );
    const winner = candidates.sort((a, b) => a - b)[0];
    result.push(winner);
    availableKeys.delete(winner);
    (childs[winner] || []).forEach(
      x => (parents[x] = parents[x].filter(b => b !== winner))
    );
  }
  return printRes(result);
};

const solution2 = parsedLines => {
  const availableKeys = new Set();
  const result = [];
  let currentTime = 0;
  const candidates = new pQueue((b, a) => a - b);
  const N_WORKERS = 5;
  const STEP_TIME = 60;

  const workers = new pQueue((b, a) => a.endsAt - b.endsAt);

  const addNewCandidates = (possible = []) => {
    const newCandidates = possible.filter(
      x => !parents[x] || parents[x].length === 0
    );
    newCandidates.forEach(x => {
      candidates.enq(parseInt(x, 10));
    });
  };

  const removeWinner = winner => {
    result.push(winner);
    availableKeys.delete(winner);
    (childs[winner] || []).forEach(
      x => (parents[x] = (parents[x] || []).filter(b => b !== winner))
    );

    addNewCandidates(childs[winner]);
  };

  const addWorkers = () => {
    while (workers.size() < N_WORKERS && candidates.size() > 0) {
      const diff = candidates.deq();
      workers.enq({
        workingOn: diff,
        endsAt: currentTime + diff + STEP_TIME + 1,
      });
    }
  };

  parsedLines.forEach(({parent, child}) => {
    childs[child] = (childs[child] || []).concat(parent);
    parents[parent] = (parents[parent] || []).concat(child);
    availableKeys.add(parent);
    availableKeys.add(child);
  });

  addNewCandidates([...availableKeys]);
  addWorkers();
  do {
    const worker = workers.deq();
    removeWinner(worker.workingOn);
    currentTime = worker.endsAt;
    addWorkers();
  } while (workers.size() > 0);

  return currentTime;
};

module.exports = [
  pipe(
    parseLines,
    solution1
  ),
  pipe(
    parseLines,
    solution2
  ),
];
