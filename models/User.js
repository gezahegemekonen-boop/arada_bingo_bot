const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: String,
  role: { type: String, default: "player" },  // "admin" or "player"
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
