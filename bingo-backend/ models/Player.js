const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  language: { type: String, enum: ['am', 'en'], default: 'am' },
  lastPlayed: { type: Date },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);
