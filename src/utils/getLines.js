const {compose: c, init, split} = require('ramda');

module.exports = c(init, split('\n'));
