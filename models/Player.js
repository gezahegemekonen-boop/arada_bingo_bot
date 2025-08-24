const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  tgId: { type: String, unique: true, index: true },
  name: String,
  username: String,
  createdAt: { type: Date, default: Date.now },
  wallet: { type: Number, default: 0 },
  playWallet: { type: Number, default: 0 },
  referredBy: { type: String, default: null },
  hasClaimedReferral: { type: Boolean, default: false },
  lastDailyBonusAt: { type: Date, default: null },
  wins: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  stakeGroup: { type: Number, default: null }
});

module.exports = mongoose.model('Player', playerSchema);

