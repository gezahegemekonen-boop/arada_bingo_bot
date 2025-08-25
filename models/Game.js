const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
});

module.exports = mongoose.model("Game", gameSchema);
