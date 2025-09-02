const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  name: { type: String },
  wallet: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  language: { type: String, default: 'en' },
  referredBy: { type: String },
  referralBonusGiven: { type: Boolean, default: false },
  lastBonusClaim: { type: Date, default: null },
  card: { type: Array, default: [] },
  totalGamesPlayed: { type: Number, default: 0 },
  totalWins: { type: Number, default: 0 },
  totalPayouts: { type: Number, default: 0 }
});

module.exports = mongoose.model('Player', PlayerSchema);
