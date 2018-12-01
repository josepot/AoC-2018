const {add} = require('ramda');

const toInt = x => parseInt(x, 10);

module.exports = inputLines => inputLines.map(toInt).reduce(add);
