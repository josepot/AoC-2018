const {compose: c, map, sum} = require('ramda');

module.exports = c(sum, map(parseInt));
