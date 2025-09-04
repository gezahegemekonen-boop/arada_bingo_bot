// bingo-backend/models/BingoRound.js
import mongoose from 'mongoose';

const bingoRoundSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  roundId: { type: String, required: true, unique: true },
  card: { type: Array, required: true },
  hasWon: { type: Boolean, default: false },
  stake: { type: Number, default: 1 },
  payoutAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'won', 'rejected', 'paid'], default: 'pending' },
  isPaid: { type: Boolean, default: false },
  adminNote: { type: String },
  paidAt: { type: Date },
  joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('BingoRound', bingoRoundSchema);
