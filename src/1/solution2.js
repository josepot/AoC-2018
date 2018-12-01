const toInt = x => parseInt(x, 10);

module.exports = inputLines => {
  const values = inputLines.map(toInt);
  const data = new Set();
  let acc = 0;

  for (let i = 0; i < Infinity; i++) {
    acc += values[i % values.length];
    if (data.has(acc)) return acc;
    data.add(acc);
  }
};
