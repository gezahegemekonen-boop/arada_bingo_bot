// src/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  playerId: { type: String, required: true },  // TelegramId
  type: { type: String, enum: ['deposit', 'withdraw'], required: true },
  amount: { type: Number, required: true },
  approved: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  method: { type: String },  // e.g., Telebirr
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
