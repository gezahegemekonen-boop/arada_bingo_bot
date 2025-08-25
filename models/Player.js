const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Telegram user ID
  username: { type: String },
  balance: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Player", playerSchema);
