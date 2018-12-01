const {compose: c, init, split} = require('ramda');
const {promisify} = require('util');
const fs = require('fs');

const {log} = console;
const readFile = promisify(fs.readFile);
const getLines = c(init, split('\n'));

const [, , day, isSecond] = process.argv;
const fn = require(`./${day}/solution`)[isSecond ? 1 : 0];

readFile(`./${day}/input`, 'utf-8').then(c(log, fn, getLines));
