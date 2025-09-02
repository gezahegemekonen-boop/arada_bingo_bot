// utils/roomManager.js

const rooms = {}; // key: roomId, value: room object

function getRoom(roomId) {
  return rooms[roomId] || null;
}

function getRoomByPlayerId(playerId) {
  return Object.values(rooms).find(room => room.players && room.players[playerId]);
}

function addRoom(roomId, roomData = {}) {
  if (!roomId) throw new Error('Room ID is required');
  rooms[roomId] = {
    ...roomData,
    players: roomData.players || {},
    createdAt: new Date()
  };
}

function removeRoom(roomId) {
  delete rooms[roomId];
}

function listRooms() {
  return Object.keys(rooms);
}

module.exports = {
  getRoom,
  getRoomByPlayerId,
  addRoom,
  removeRoom,
  listRooms,
  rooms
};
