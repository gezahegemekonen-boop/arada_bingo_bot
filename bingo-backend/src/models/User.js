// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String },
  coins: { type: Number, default: 0 },
  language: { type: String, enum: ['en', 'am'], default: 'en' },
  referredBy: { type: String },  // TelegramId of the person who referred
  referralBonusGiven: { type: Boolean, default: false },
  lastBonusClaim: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
