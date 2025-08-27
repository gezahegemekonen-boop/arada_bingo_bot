const rooms = {}; // { stake: { players: [], caller: NumberCaller, cards: [] } }

function addPlayerToRoom(player, stake) {
  if (!rooms[stake]) {
    rooms[stake] = {
      players: [],
      cards: generate100Cards(),
      caller: new NumberCaller()
    };
  }

  const room = rooms[stake];
  const card = room.cards.pop();
  player.card = card;
  room.players.push(player);

  if (room.players.length >= 2) {
    room.caller.start(room.players, sendMessage);
  }
}

function generate100Cards() {
  return Array.from({ length: 100 }, () => generateCard());
}

module.exports = { addPlayerToRoom };
