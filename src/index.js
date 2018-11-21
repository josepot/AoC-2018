const {promisify} = require('util');
const fs = require('fs');

const readFile = promisify(fs.readFile);
const day = process.argv[2];
const fn = require(`./${day}/solution`);

readFile(`./${day}/input`, 'utf-8')
  .then(fn)
  .then(x => console.log(x));
