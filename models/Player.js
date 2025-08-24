const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  userId: { type: String, required: true },   // Telegram user ID
  username: String,                           // Telegram username
  balance: { type: Number, default: 0 },      // Player’s wallet balance
  score: { type: Number, default: 0 },        // Points earned
  gamesPlayed: { type: Number, default: 0 },  // Total games played
  jackpotWins: { type: Number, default: 0 }   // Count of jackpot wins
});

module.exports = mongoose.model("Player", playerSchema);
