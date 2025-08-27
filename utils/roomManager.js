// utils/roomManager.js

const rooms = {}; // key: roomId, value: room object

function getRoomByPlayerId(playerId) {
  return Object.values(rooms).find(room => room.players[playerId]);
}

function getRoom(roomId) {
  return rooms[roomId];
}

function addRoom(roomId, roomData) {
  rooms[roomId] = roomData;
}

module.exports = {
  getRoomByPlayerId,
  getRoom,
  addRoom,
  rooms
};
