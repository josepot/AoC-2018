const {compose: c, init, split, tap} = require('ramda');
const {promisify} = require('util');
const fs = require('fs');
const {isObservable} = require('rxjs');

let start;
const log = v => {
  let end = Date.now();
  if (isObservable(v)) {
    return v.subscribe(console.log, console.error);
  }
  console.log(v);
  console.log(`Solved in ${end - start}ms`);
};
const readFile = promisify(fs.readFile);
const getLines = c(init, split('\n'));
const clearScreen = () => {
  console.clear();
  console.clear();
};

const [, , day, isSecond] = process.argv;
const fn = require(`./${day}/solution`)[isSecond ? 1 : 0];

readFile(`./${day}/input`, 'utf-8').then(
  c(log, fn, tap(() => (start = Date.now())), getLines, tap(clearScreen))
);
