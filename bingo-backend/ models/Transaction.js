const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  playerId: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'withdraw'], required: true },
  approved: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  method: { type: String, default: 'Telebirr' }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
