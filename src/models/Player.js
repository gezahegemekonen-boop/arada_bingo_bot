import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  telegramId: { type: String, index: true, required: true, unique: true },
  username: String,
  balance: { type: Number, default: 0 },
  language: { type: String, enum: ['en', 'am'], default: 'en' },
  banned: { type: Boolean, default: false },
  wins: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },

  // ✅ Referral system fields
  referralCode: { type: String },
  referrals: [{ type: String }],
  referralCoins: { type: Number, default: 0 }
});

export default mongoose.model('Player', PlayerSchema);
