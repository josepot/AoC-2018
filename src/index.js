const {compose: c, init, split} = require('ramda');
const {promisify} = require('util');
const fs = require('fs');
const { isObservable } = require('rxjs');

const log = v => {
    if(isObservable(v)) {
        return v.subscribe(console.log, console.error);
    }
    console.log(v);
}
const readFile = promisify(fs.readFile);
const getLines = c(init, split('\n'));

const [, , day, isSecond] = process.argv;
const fn = require(`./${day}/solution${isSecond ? 2 : ''}`);

readFile(`./${day}/input`, 'utf-8').then(c(log, fn, getLines));
