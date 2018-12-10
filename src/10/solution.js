const MAX = 100;

const parseLine = x =>
  x
    .match(/position=<(.*),(.*)> velocity=<(.*),(.*)>/)
    .slice(1)
    .map(x => parseInt(x, 10));

const getMaxDistance = positions => {
  const minX = positions.reduce((acc, [x]) => (x < acc ? x : acc), Infinity);
  const maxX = positions.reduce((acc, [x]) => (x > acc ? x : acc), -Infinity);
  const minY = positions.reduce((acc, [, y]) => (y < acc ? y : acc), Infinity);
  const maxY = positions.reduce((acc, [, y]) => (y > acc ? y : acc), -Infinity);
  const x = maxX - minX;
  const y = maxY - minY;
  return {x, y, minX, minY};
};

const getNextLine = ([x, y, xDelta, yDelta]) => [
  x + xDelta,
  y + yDelta,
  xDelta,
  yDelta,
];

const getLines = (xMin, yMin, data) => {
  const lines = new Array(MAX + 1);
  for (let i = 0; i < lines.length; i++) {
    lines[i] = new Array(MAX + 1);
    for (let z = 0; z < lines[i].length; z++) {
      lines[i][z] = ' ';
    }
  }
  data.forEach(([x, y]) => {
    lines[x - xMin][y - yMin] = '#';
  });
  return lines;
};

const solution1 = lines => {
  let data = lines.map(parseLine);
  let distances;
  let count = 0;

  do {
    data = data.map(getNextLine);
    count++;
    distances = getMaxDistance(data);
  } while (distances.x > MAX || distances.y > MAX);

  do {
    console.log('START', count);
    getLines(distances.minX, distances.minY, data).forEach(x => {
      console.log(x.join(''));
    });
    data = data.map(getNextLine);
    count++;
    distances = getMaxDistance(data);
    console.log('');
    console.log('END');
    console.log('');
  } while (distances.x < MAX && distances.y < MAX);
};

module.exports = [solution1];
