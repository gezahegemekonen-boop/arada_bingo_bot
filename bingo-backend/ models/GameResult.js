const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  stake: { type: Number, required: true },
  card: { type: [[mongoose.Schema.Types.Mixed]], required: true },
  calledNumbers: { type: [Number], required: true },
  won: { type: Boolean, required: true },
  winType: { type: String, enum: ['row', 'column', 'diagonal', 'corners', null], default: null },
  timestamp: { type: Date, default: Date.now }
});

const GameResult = mongoose.model('GameResult', gameResultSchema);
module.exports = GameResult;
