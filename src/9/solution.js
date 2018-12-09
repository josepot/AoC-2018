const zeroMarble = {marble: 0};
zeroMarble.next = zeroMarble;
zeroMarble.prev = zeroMarble;

let current = zeroMarble;
const scores = {};

const scorePoint = (player, marble) => {
  scores[player] = (scores[player] || 0) + marble;

  for (let i = 0; i < 7; i++) current = current.prev;
  scores[player] += current.marble;

  current.prev.next = current.next;
  current.next.prev = current.prev;
  current = current.next;
};

const addMarble = (player, marble) => {
  if (marble % 23 === 0) return scorePoint(player, marble);

  const newMarble = {
    marble,
    prev: current.next,
    next: current.next.next,
  };
  current.next.next.prev = newMarble;
  current.next.next = newMarble;
  current = newMarble;
};

const play = (lastMarble, totalPlayers) => {
  for (let i = 1; i < lastMarble + 1; i++) addMarble(i % totalPlayers, i);
  const winner = Object.keys(scores).sort((b, a) => scores[a] - scores[b])[0];
  return scores[winner];
};

const input = [71920, 403];
module.exports = [
  play.bind(null, ...input),
  play.bind(null, input[0] * 100, input[1]),
];
