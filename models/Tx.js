const mongoose = require('mongoose');

const txSchema = new mongoose.Schema({
  tgId: String,
  type: { type: String, enum: ['deposit','withdraw','payout','commission','jackpot','referral','daily'], required: true },
  amount: Number,
  method: { type: String, default: null },
  status: { type: String, enum: ['pending','approved','rejected','done'], default: 'pending' },
  note: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tx', txSchema);

