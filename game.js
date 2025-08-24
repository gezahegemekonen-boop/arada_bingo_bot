const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  chatId: String,
  players: [String],
  numbersCalled: [Number],
  isActive: { type: Boolean, default: true },
  jackpot: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 }
});

module.exports = mongoose.model("Game", gameSchema);

