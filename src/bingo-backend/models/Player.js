import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true, index: true },
  username: { type: String },
  balance: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  language: { type: String, enum: ['am', 'en'], default: 'am' },
  lastPlayed: { type: Date },
  isAdmin: { type: Boolean, default: false },
  banned: { type: Boolean, default: false },
  wins: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },

  // ✅ Referral system fields
  referralCode: { type: String },           // e.g. same as telegramId
  referrals: [{ type: String }],            // array of telegramIds invited
  referralCoins: { type: Number, default: 0 } // coins earned from referrals
});

const Player = mongoose.model('Player', PlayerSchema);
export default Player;

