const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  playerId: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 },
  type: { type: String, enum: ['deposit', 'withdraw'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  method: { type: String, default: 'Telebirr' },
  adminNote: { type: String, default: '' },
  approvedAt: { type: Date },
  rejectedAt: { type: Date }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
