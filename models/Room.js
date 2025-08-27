const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  stake: Number,
  players: [String], // telegram IDs or player refs
  roundId: {
    type: String,
    default: () => new Date().toISOString()
  },
  cards: [Object], // optional: store assigned cards
  winner: String,  // telegram ID of winner
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Room', roomSchema);

