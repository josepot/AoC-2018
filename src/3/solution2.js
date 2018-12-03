const {compose: c, map, max, reduce, prop} = require('ramda');

const toInt = x => parseInt(x, 10);

const getData = line => {
  const [id, , leftTop, widthHeight] = line.split(' ');
  const [left, top] = leftTop
    .slice(0, -1)
    .split(',')
    .map(toInt);
  const [width, height] = widthHeight.split('x').map(toInt);
  return {id, left, top, width, height};
};

const getSize = ({left, top, width, height}) => ({
  w: left + width,
  h: top + height,
});

const getMax = x => c(reduce(max, 0), map(prop(x)));
const write_ = (data, width) => (x, y, id) => {
  const position = y * width + x;
  if (data[position] === undefined) {
    return (data[position] = {total: 1, id});
  }
  data[position].id = id;
  data[position].total++;
};

const getId_ = (data, width) => (x, y) => {
  const position = y * width + x;
  return data[position].total === 1 && data[position].id;
};

module.exports = rawLines => {
  const lines = rawLines.map(getData);
  const sizes = lines.map(getSize);

  const [maxWidth, maxHeight] = ['w', 'h'].map(getMax).map(fn => fn(sizes));
  const data = new Array(maxWidth * maxHeight);
  const write = write_(data, maxWidth);
  const getId = getId_(data, maxWidth);

  lines.forEach(({id, left, top, width, height}) => {
    for (let x = left; x < left + width; x++) {
      for (let y = top; y < top + height; y++) {
        write(x, y, id);
      }
    }
  });

  return lines.find(({id, left, top, width, height}) => {
    for (let x = left; x < left + width; x++) {
      for (let y = top; y < top + height; y++) {
        if (getId(x, y) !== id) return false;
      }
    }
    return true;
  }).id;
};
