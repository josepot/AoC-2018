const {last, map, pipe, reduce, sort, sum, values} = require('ramda');

const parseLine = line => {
  const [, rawDate, message] = line.match(/^\[(.*)]\s(.*)$/);
  const minute = parseInt(rawDate.split(' ')[1].split(':')[1]);
  const time = new Date(rawDate).getTime();
  const [id, isAwake] = message.startsWith('Guard')
    ? [parseInt(message.split(' ')[1].slice(1)), null]
    : [null, message.startsWith('wakes')];
  return {
    id,
    time,
    rawDate,
    isAwake,
    minute,
    line,
  };
};

const getGuardsData = pipe(
  reduce((acc, {id, isAwake, minute}) => {
    if (id) {
      acc.push({
        id,
        sleepTimes: [],
      });
      return acc;
    }

    const current = last(acc);
    if (isAwake) {
      last(current.sleepTimes).end = minute;
      return acc;
    }
    current.sleepTimes.push({start: minute, end: 60});
    return acc;
  }, []),
  reduce((acc, {id, sleepTimes}) => {
    if (!acc[id]) {
      acc[id] = {id, scores: new Array(60)};
      for (let i = 0; i < 60; i++) acc[id].scores[i] = 0;
    }
    sleepTimes.forEach(({start, end}) => {
      for (let i = start; i < end; i++) acc[id].scores[i]++;
    });
    return acc;
  }, {})
);

const getSleepyGuard = reduce(
  (acc, {id, scores}) => {
    const total = sum(scores);
    return total > acc.total ? {id, scores, total} : acc;
  },
  {id: 'FAKE', scores: [], total: 0}
);

const getSleepyMinute = scores =>
  scores.reduce((acc, val, idx, arr) => (val > arr[acc] ? idx : acc), 0);

const getGuardsDataValues = pipe(
  map(parseLine),
  sort((a, b) => a.time - b.time),
  getGuardsData,
  values
);

const solution1 = pipe(
  getGuardsDataValues,
  getSleepyGuard,
  ({id, scores}) => id * getSleepyMinute(scores)
);

const solution2 = pipe(
  getGuardsDataValues,
  map(({id, scores}) => {
    const sleepyMinute = getSleepyMinute(scores);
    const total = scores[sleepyMinute];
    return {id, sleepyMinute, total};
  }),
  reduce((acc, current) => (current.total > acc.total ? current : acc), {
    id: 'FAKE',
    total: 0,
    sleepyMinute: 0,
  }),
  ({id, sleepyMinute}) => id * sleepyMinute
);

module.exports = [solution1, solution2];
