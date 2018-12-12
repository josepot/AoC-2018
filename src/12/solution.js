const nextGeneration = (current, instructions) => {
  const result = new Set();
  const from = Math.min.apply(null, [...current]);
  const to = Math.max.apply(null, [...current]);

  for (let i = from - 3; i < to + 3; i++) {
    const pattern = [-2, -1, 0, 1, 2]
      .map(x => current.has(i + x))
      .map(x => (x ? '#' : '.'))
      .join('');
    if (instructions.indexOf(pattern) > -1) result.add(i);
  }
  return result;
};

const isPlant = x => x === '#';
const toBooleans = str => str.split('').map(isPlant);
const solution1 = lines => {
  const initialState = new Set();
  toBooleans(lines[0].slice(15)).forEach((x, idx) => {
    if (x) {
      initialState.add(idx);
    }
  });

  const instructions = lines
    .slice(2)
    .map(rawLine => {
      const [command, rPlant] = rawLine.split(' => ');
      return {
        command,
        producesPlant: isPlant(rPlant),
      };
    })
    .filter(({producesPlant}) => producesPlant)
    .map(({command}) => command);

  let current = initialState;
  for (let i = 0; i < 200; i++) {
    current = nextGeneration(current, instructions);
  }

  return [...current].reduce((x, y) => x + y);
};

module.exports = [solution1];
