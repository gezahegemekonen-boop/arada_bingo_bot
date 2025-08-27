const NumberCaller = require('./NumberCaller'); // Make sure this path is correct
const { generateCard } = require('./cardGenerator'); // Your card generation logic

const rooms = {}; // { stake: { players: [], cards: [], caller: NumberCaller, winners: [], isActive: false } }

function generate100Cards() {
  return Array.from({ length: 100 }, () => generateCard());
}

function addPlayerToRoom(player, stake) {
  if (!rooms[stake]) {
    rooms[stake] = {
      players: [],
      cards: generate100Cards(),
      caller: new NumberCaller(),
      winners: [],
      isActive: false
    };
  }

  const room = rooms[stake];
  const card = room.cards.pop();
  player.card = card;
  room.players.push(player);

  if (room.players.length >= 2 && !room.isActive) {
    room.isActive = true;
    room.caller.start(room.players, sendMessage); // Make sure sendMessage is defined
  }
}

function getRoomByPlayerId(playerId) {
  for (const stake in rooms) {
    const room = rooms[stake];
    if (room.players.find(p => p.telegramId === playerId || p.id === playerId)) {
      return room;
    }
  }
  return null;
}

function resetRoomByPlayerId(playerId) {
  const room = getRoomByPlayerId(playerId);
  if (!room) return;

  room.players = [];
  room.cards = generate100Cards();
  room.winners = [];
  room.isActive = false;

  if (room.caller?.stop) {
    room.caller.stop();
  }
  room.caller = new NumberCaller();
}

// ✅ New: Remove player from their room
function removePlayerFromRoom(playerId) {
  for (const stake in rooms) {
    const room = rooms[stake];
    const index = room.players.findIndex(p => p.telegramId === playerId || p.id === playerId);
    if (index !== -1) {
      room.players.splice(index, 1);
      break;
    }
  }
}

module.exports = {
  addPlayerToRoom,
  getRoomByPlayerId,
  resetRoomByPlayerId,
  removePlayerFromRoom, // ✅ Exported for /leave
  rooms
};
