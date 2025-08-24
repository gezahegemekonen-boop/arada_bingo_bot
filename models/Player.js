const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  userId: String,
  username: String,
  score: { type: Number, default: 0 }
});

module.exports = mongoose.model("Player", playerSchema);


