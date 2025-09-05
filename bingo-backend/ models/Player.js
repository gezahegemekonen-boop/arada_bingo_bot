import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  language: { type: String, enum: ['am', 'en'], default: 'am' },
  lastPlayed: { type: Date },
  isAdmin: { type: Boolean, default: false },
  referralCode: { type: String },
  referrals: [{ type: String }],
  referralCoins: { type: Number, default: 0 }
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);
export default Player;
