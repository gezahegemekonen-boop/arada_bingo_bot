import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  language: { type: String, enum: ['am','en'], default: 'am' },
  lastPlayed: { type: Date },
  isAdmin: { type: Boolean, default: false },

  // ✅ Referral system fields
  referralCode: { type: String },           // e.g. same as telegramId
  referrals: [{ type: String }],            // array of telegramIds invited
  referralCoins: { type: Number, default: 0 } // coins earned from referrals
}, { timestamps: true });

export default mongoose.model('Player', playerSchema);
