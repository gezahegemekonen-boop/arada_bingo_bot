const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "active", "finished"], default: "pending" }
});

module.exports = mongoose.model("Game", GameSchema);
