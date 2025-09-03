const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  gamesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  lastPlayedAt: { type: Date, default: null }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
