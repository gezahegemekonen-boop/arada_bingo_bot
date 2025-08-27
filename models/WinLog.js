// models/WinLog.js

const mongoose = require('mongoose');

const winLogSchema = new mongoose.Schema({
  playerId: String,
  roomId: String,
  timestamp: { type: Date, default: Date.now },
  pattern: String // optional: "horizontal", "diagonal", etc.
});

module.exports = mongoose.model('WinLog', winLogSchema);
