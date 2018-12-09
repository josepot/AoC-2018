const R  = require('ramda');

const zeroMarble = {
  id: 0,
};
zeroMarble.next = zeroMarble;
zeroMarble.prev = zeroMarble;
let current = zeroMarble;

const scores = {};

const scorePoint = (player, marble) => {
  scores[player] = (scores[player] || 0) + marble;
  for (let i = 0; i < 7; i++) {
    current = current.prev;
  }
  scores[player] += current.id;
  current.prev.next = current.next;
  current.next.prev = current.prev;
  current = current.next;
};

const addMarble = (player, marble) => {
  if (marble % 23 === 0) {
    return scorePoint(player, marble);
  }
  const newMarble = {
    id: marble,
    prev: current.next,
    next: current.next.next,
  };
  current.next.next.prev = newMarble;
  current.next.next = newMarble;
  current = newMarble;
};

const solution1 = () => {
  const lastMarble = 71920 * 100;
  const totalPlayers = 403;
  let currentPlayer = 1;
  for (let i = 1; i < lastMarble + 1; i++) {
    addMarble(currentPlayer++ % totalPlayers, i);
  }
  const winner = Object.keys(scores).sort((b, a) => scores[a] - scores[b])[0];
  return [winner, scores[winner]];
};

module.exports = [solution1];
