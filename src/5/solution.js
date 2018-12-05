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

const solution1 = pipe();

const solution2 = pipe(
);

module.exports = [solution1, solution2];
