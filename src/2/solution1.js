const {
  compose: c,
  converge,
  identity,
  either,
  equals,
  filter,
  groupBy,
  length,
  map,
  multiply,
  pipe,
  prop,
  values,
} = require('ramda');

const getLineGroups = pipe(
  groupBy(identity),
  map(length),
  filter(either(equals(2), equals(3))),
  values,
  groupBy(identity)
);

const getN = id => c(length, filter(prop(id)));

module.exports = pipe(
  map(getLineGroups),
  converge(multiply, [getN(2), getN(3)])
);
