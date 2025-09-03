// src/models/Player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String },
  wallet: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  language: { type: String, enum: ['en', 'am'], default: 'en' },
  referredBy: { type: String },  // TelegramId of referrer
  referralBonusGiven: { type: Boolean, default: false },
  lastBonusClaim: { type: Date },
  card: { type: Array, default: [] }, // Bingo card 5x5
  isApproved: { type: Boolean, default: false },
  totalGamesPlayed: { type: Number, default: 0 },
  totalWins: { type: Number, default: 0 },
  totalPayouts: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
