const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  chatId: String,                  // Telegram group chat ID
  players: [String],                // Array of player IDs/usernames
  numbersCalled: [Number],          // Numbers already called
  isActive: { type: Boolean, default: true },
  jackpot: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 }
});

module.exports = mongoose.model("Game", gameSchema);
